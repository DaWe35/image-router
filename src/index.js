import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import fetch from 'node-fetch'
import { imageRoutes } from './routes/imageRoutes.js'
import { videoRoutes } from './routes/videoRoutes.js'
import { imageModels } from './shared/imageModels/index.js'
import { videoModels } from './shared/videoModels/index.js'
import { validateApiKey } from './middleware/apiKeyMiddleware.js'
import { prisma } from './config/database.js'
import { getGeminiApiKey } from './services/imageHelpers.js'
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
const protectedImageChain = process.env.DATABASE_URL ? [ipLimiter, validateApiKey, userImageLimiter] : [ipLimiter]
const protectedVideoChain = process.env.DATABASE_URL ? [ipLimiter, validateApiKey, userVideoLimiter] : [ipLimiter]

// Apply chains to routes
app.use('/v1/openai/images/generations', ...protectedImageChain)
app.use('/v1/openai/images/edits', ...protectedImageChain)
app.use('/v1/openai/videos/generations', ...protectedVideoChain)

// Debug endpoint that returns the detected client IP
app.get('/ip', (req, res) => {
    const proxyCount = Number(process.env.PROXY_COUNT || 0)
    const clientIp = proxyCount > 0 ? req.headers['cf-connecting-ip'] : req.ip
    res.json({ ip: clientIp })
})

// Routes
app.use('/v1/openai/images', imageRoutes)
app.use('/v1/openai/videos', videoRoutes)
app.use('/v1/auth', authRoutes)

app.get('/v1/models', (req, res) => {
    const removeProvider = obj => {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            acc[key] = { ...value }
            return acc
        }, {})
    }
    res.json({
        ...removeProvider(imageModels),
        ...removeProvider(videoModels)
    })
})

app.get('/v1/models/:modelId', (req, res) => {
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

// Video proxy endpoint to serve videos without exposing API keys
app.get('/proxy/video', async (req, res) => {
    try {
        const { url, model } = req.query
        
        if (!url || !model) {
            return res.status(400).json({
                error: {
                    message: 'Missing required parameters: url and model',
                    type: 'invalid_request'
                }
            })
        }

        // Validate that the url matches the allowed endpoint pattern
        const allowedPattern = /^https:\/\/generativelanguage\.googleapis\.com\/v1beta\/files\/[^:]+:download\?alt=media$/
        if (!allowedPattern.test(url)) {
            return res.status(400).json({
                error: {
                    message: 'Invalid URL provided. Only URLs matching the allowed endpoint are permitted.',
                    type: 'invalid_url'
                }
            })
        }

        // Get the appropriate API key for the model
        const providerKey = getGeminiApiKey(model)
        
        // Fetch the video with the API key
        const videoResponse = await fetch(`${url}&key=${providerKey}`)
        
        if (!videoResponse.ok) {
            return res.status(videoResponse.status).json({
                error: {
                    message: 'Failed to fetch video',
                    type: 'video_fetch_error'
                }
            })
        }

        // Set appropriate headers
        res.setHeader('Content-Type', videoResponse.headers.get('content-type') || 'video/mp4')
        res.setHeader('Content-Length', videoResponse.headers.get('content-length'))
        
        // Stream the video content
        videoResponse.body.pipe(res)
        
    } catch (error) {
        console.error('Video proxy error:', error)
        res.status(500).json({
            error: {
                message: 'Internal server error while fetching video',
                type: 'internal_error'
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