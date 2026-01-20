import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import fetch from 'node-fetch'
import { imageRoutes } from './routes/imageRoutes.js'
import { videoRoutes } from './routes/videoRoutes.js'
import { unifiedRoutes } from './routes/unifiedRoutes.js'
import { imageModels } from './shared/imageModels/index.js'
import { videoModels } from './shared/videoModels/index.js'
import { validateApiKey } from './middleware/apiKeyMiddleware.js'
import { blockBannedIPs } from './middleware/ipBlockMiddleware.js'
import { prisma } from './config/database.js'
import { getGeminiApiKey } from './services/helpers.js'
import { storageService } from './services/storageService.js'
import YAML from 'yaml'
import { openApiDocument } from './openapiDoc.js'
import { exec } from 'child_process'
import { promisify } from 'util'
import { authRoutes } from './routes/authRoutes.js'

dotenv.config()

const execAsync = promisify(exec)

const app = express()
const port = 3000

// Enable trust proxy - required when behind reverse proxies (Docker, etc.)
// This allows express-rate-limit to correctly identify client IPs
// app.set('trust proxy', true)
// Using a more secure configuration for proxies
app.set('trust proxy', process.env.PROXY_COUNT)

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Custom key generator for rate limiting, preferring Cloudflare header
const ipKeyGenerator = (req) => {
    const proxyCount = Number(process.env.PROXY_COUNT || 0)
    return proxyCount > 0 ? req.headers['cf-connecting-ip'] : req.ip
}

// Rate limiting configurations
const generalLimiter = rateLimit({
    windowMs: 1 * 1000, // 1 seconds
    max: 20, // limit each IP to 20 requests per windowMs
    keyGenerator: ipKeyGenerator, // Use custom key generator
    message: {
        error: {
            message: 'Too many requests, please try again later.',
            type: 'rate_limit_error'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
})

const ipLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 6000, // allow up to 100 requests/sec average per IP
    keyGenerator: ipKeyGenerator, // Use custom key generator
    message: {
        error: {
            message: 'Too many image generation requests, please try again later.',
            type: 'rate_limit_error'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
})

// Dynamic API-key rate limiters (per 1-second window)
// Helper to build a rate-limit function from balance-to-limit converter
const buildUserLimiter = (calcFn, min, max) => rateLimit({
    windowMs: 1 * 1000,
    max: (req, res) => {
        const credits = res.locals.key?.user?.credits ?? 0 // stored in 1e-4 USD units
        const usdBalance = credits / 10000
        const proposed = calcFn(usdBalance)
        const clamped = Math.max(min, Math.min(max, Math.floor(proposed)))
        return clamped
    },
    keyGenerator: (req, res) => res.locals.key.user.id,
    message: {
        error: {
            message: 'API key rate limit exceeded, please try again later.',
            type: 'rate_limit_error'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
})

// Image generation: limit = balanceUSD * 4 (min 6, max 100)
const userImageLimiter = buildUserLimiter((usd) => usd * 4, 6, 100)

// Video generation: limit = balanceUSD / 6 (min 1, max 20)
const userVideoLimiter = buildUserLimiter((usd) => usd / 6, 1, 20)

app.use(generalLimiter) // Apply general limiter to all other routes

// Protected middleware chains (depend on DB availability)
const protectedImageChain = process.env.DATABASE_URL ? [blockBannedIPs, ipLimiter, validateApiKey, userImageLimiter] : [blockBannedIPs, ipLimiter]
const protectedVideoChain = process.env.DATABASE_URL ? [blockBannedIPs, ipLimiter, validateApiKey, userVideoLimiter] : [blockBannedIPs, ipLimiter]
const protectedUnifiedChain = process.env.DATABASE_URL ? [blockBannedIPs, ipLimiter, validateApiKey, userImageLimiter] : [blockBannedIPs, ipLimiter]

// Apply chains to routes
app.use('/v1/openai/images/generations', ...protectedImageChain)
app.use('/v1/openai/images/edits', ...protectedImageChain)
app.use('/v1/openai/videos/generations', ...protectedVideoChain)
app.use('/v1/responses', ...protectedUnifiedChain)

// Debug endpoint that returns the detected client IP
app.get('/ip', (req, res) => {
    const proxyCount = Number(process.env.PROXY_COUNT || 0)
    const clientIp = proxyCount > 0 ? req.headers['cf-connecting-ip'] : req.ip
    res.json({ ip: clientIp })
})

// Routes
app.use('/v1/openai/images', imageRoutes)
app.use('/v1/openai/videos', videoRoutes)
app.use('/v1', unifiedRoutes)
app.use('/v1/auth', authRoutes)

// Credits endpoint
app.get('/v1/credits', validateApiKey, async (req, res) => {
    try {
        const userId = res.locals.key.user.id
        const remainingCredits = res.locals.key.user.credits

        // Calculate total deposits by summing all completed deposits
        const depositAggregation = await prisma.deposit.aggregate({
            where: { 
                userId,
                status: 'COMPLETED'
            },
            _sum: {
                creditsAdded: true
            }
        })

        const totalDeposits = depositAggregation._sum.creditsAdded || 0
        const totalUsage = totalDeposits - remainingCredits

        // Convert from database format (1e-4 USD) to USD
        const toUSD = (value) => (value / 10000).toFixed(4)

        const response = {
            remaining_credits: toUSD(remainingCredits),
            credit_usage: toUSD(totalUsage),
            total_deposits: toUSD(totalDeposits),
        }

        if (req.query.by_api_key === 'true') {
            const usageByApiKey = await prisma.aPIUsage.groupBy({
                by: ['apiKeyId', 'apiKeyTempJwt'],
                where: { 
                    userId
                },
                _sum: {
                    cost: true
                },
                _count: {
                  _all: true
                }
            })

            // Fetch API key details to make the response more useful
            const apiKeys = await prisma.aPIKey.findMany({
                where: { userId },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    isActive: true
                }
            })

            const apiKeyMap = apiKeys.reduce((acc, key) => {
                acc[key.id] = key
                return acc
            }, {})

            response.usage_by_api_key = usageByApiKey.map(usage => {
                const keyDetails = usage.apiKeyId ? apiKeyMap[usage.apiKeyId] : null
                
                let name = 'Unknown Key'
                if (usage.apiKeyId) {
                    name = keyDetails?.name || 'Deleted Key'
                } else if (usage.apiKeyTempJwt) {
                    name = 'Temporary web token (imagerouter.io)'
                }

                return {
                    api_key_id: usage.apiKeyId || (usage.apiKeyTempJwt ? 'temp_jwt' : 'unknown'),
                    api_key_name: name,
                    credit_usage: toUSD(usage._sum.cost || 0),
                    total_requests: usage._count._all,
                    created_at: keyDetails?.createdAt || null,
                    is_active: keyDetails?.isActive ?? true
                }
            })
        }

        return res.json(response)
    } catch (error) {
        console.error('Error fetching credit information:', error)
        return res.status(500).json({
            error: {
                message: 'Failed to fetch credit information',
                type: 'internal_error'
            }
        })
    }
})

app.get('/v1/models', (req, res) => {
    const { type, provider, free, name, sort, limit } = req.query

    let allModels = {
        ...imageModels,
        ...videoModels
    }

    let modelsArray = Object.entries(allModels).map(([id, modelData]) => ({
        id,
        ...modelData,
        provider: id.split('/')[0]
    }))

    // Filtering
    if (type) {
        modelsArray = modelsArray.filter(model => {
            if (type === 'image') return model.output.includes('image')
            if (type === 'video') return model.output.includes('video')
            return true
        })
    }

    if (provider) {
        modelsArray = modelsArray.filter(model => model.provider.toLowerCase().includes(provider.toLowerCase()))
    }

    if (free) {
        const isFree = free === 'true'
        modelsArray = modelsArray.filter(model => {
            const hasFreeProvider = model.providers.some(p => p.pricing.value === 0)
            return isFree ? hasFreeProvider : !hasFreeProvider
        })
    }

    if (name) {
        modelsArray = modelsArray.filter(model => model.id.toLowerCase().includes(name.toLowerCase()))
    }

    // Sorting
    if (sort) {
        modelsArray.sort((a, b) => {
            switch (sort) {
                case 'name':
                    return a.id.localeCompare(b.id)
                case 'provider':
                    return a.provider.localeCompare(b.provider)
                case 'price':
                    const aPrice = a.providers[0]?.pricing.value ?? Infinity
                    const bPrice = b.providers[0]?.pricing.value ?? Infinity
                    return aPrice - bPrice
                case 'date':
                    return new Date(b.release_date || 0) - new Date(a.release_date || 0)
                default:
                    return 0
            }
        })
    }

    // Limiting
    if (limit) {
        modelsArray = modelsArray.slice(0, parseInt(limit, 10))
    }

    // Convert back to object format
    const result = modelsArray.reduce((acc, model) => {
        const { id, ...modelData } = model
        delete modelData.provider // Clean up the added provider field
        acc[id] = modelData
        return acc
    }, {})

    res.json(result)
})

app.get('/v1/models/:modelId(.+)', (req, res) => {
    const { modelId } = req.params
    const allModels = { ...imageModels, ...videoModels }
    const model = allModels[modelId]

    if (model) {
        res.json(model)
    } else {
        res.status(404).json({
            error: {
                message: `The model '${modelId}' does not exist.`,
                type: 'invalid_request_error',
                param: 'model',
                code: 'model_not_found'
            }
        })
    }
})


// Timeout test endpoint
app.get('/timeout-test',
    (req, res) => {
        const delay = Number(req.query.delay) || 1000
        res.setHeader('Content-Type', 'application/json')
        res.flushHeaders()
        const heartbeatInterval = 1000
        const intervalId = setInterval(() => {
            res.write(' ')
        }, heartbeatInterval)

        setTimeout(() => {
            clearInterval(intervalId)
            res.write(JSON.stringify({ message: `Response delayed by ${delay} ms` }))
            res.end()
        }, delay)
    }
)

// Endpoint returns 507 if disk space is low (80% used)
// This endpoint can be watched by UptimeRobot.
app.get('/disk-space', async (req, res) => {
    try {
        const { stdout } = await execAsync('df -k /')
        const used = parseInt(stdout.trim().split('\n')[1].split(/\s+/)[4]) // "Use%" column

        if (used > 80) {
            console.log('Low disk space:', used + '% used')
            return res.sendStatus(507)
        }

        res.sendStatus(200)
    } catch (error) {
        console.error('Disk space check error:', error)
        res.sendStatus(500)
    }
})

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

// Serve generated OpenAPI spec
app.get('/.well-known/openapi.yaml', (req, res) => {
    res.type('yaml').send(YAML.stringify(openApiDocument))
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        error: {
            message: 'Internal server error',
            type: 'internal_error'
        }
    })
})

// Graceful shutdown
process.on('SIGINT', async () => {
    if (prisma) {
        await prisma.$disconnect()
    }
    process.exit(0)
})

app.listen(port, () => {
    console.log(`Server running on port ${process.env.PORT}`)
}) 