import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { imageRoutes } from './routes/imageRoutes.js'
import { validateApiKey } from './middleware/apiKeyMiddleware.js'
import { prisma } from './config/database.js'

dotenv.config()

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
    return process.env.PROXY_COUNT > 0 ? req.headers['cf-connecting-ip'] : req.ip
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
    max: 30, // limit each IP to 30 requests per minute
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

// API Key based rate limiting configuration
const userLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // limit each API key to 60 requests
    keyGenerator: (req, res) => {
        return res.locals.key.user.id
    },
    message: {
        error: {
            message: 'API key rate limit exceeded, please try again later.',
            type: 'rate_limit_error'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
})

// New middleware for daily free tier limit
const freeTierLimiter = async (req, res, next) => {
    // This limiter only applies if an API key is present and validated
    if (!res.locals.key) {
        return next() // Should have been caught by validateApiKey if key was required but missing/invalid
    }

    const { model } = req.body
    const userId = res.locals.key.user.id

    // Check if it's a free model request
    if (model && model.endsWith(':free')) {
        try {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const todayUsage = await prisma.APIUsage.count({
                where: {
                    userId: userId,
                    model: {
                        endsWith: ':free'
                    },
                    createdAt: {
                        gte: today
                    }
                }
            })

            const dailyFreeLimit = 50

            if (todayUsage >= dailyFreeLimit) {
                return res.status(429).json({
                    error: {
                        message: `Daily limit of ${dailyFreeLimit} free requests reached. There is no limit on paid models.`,
                        type: "rate_limit_error"
                    }
                })
            }
        } catch (error) {
            console.error("Error checking free tier limit:", error)
            // Decide if we should block the request or allow it if the check fails
            // For now, let's block it to be safe
            return res.status(500).json({
                error: {
                    message: 'Failed to verify free tier usage limit',
                    type: 'internal_error'
                }
            })
        }
    }

    // If not a free model or limit not reached, proceed
    next()
}

app.use(generalLimiter) // Apply general limiter to all other routes

// Define a protected middleware chain based on DATABASE_URL availability
const protectedChain = process.env.DATABASE_URL ? [ipLimiter, validateApiKey, userLimiter, freeTierLimiter] : [ipLimiter]

// Apply the protected middleware chain to both image generations and edits routes
app.use('/v1/openai/images/generations', ...protectedChain)
app.use('/v1/openai/images/edits', ...protectedChain)

// Modified IP endpoint to show headers for debugging
app.get('/ip', (request, response) => {
    const clientIp = request.headers['cf-connecting-ip'] || request.ip
    response.json({ ip: clientIp })
})

// Routes
app.use('/v1/openai/images', imageRoutes)

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

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
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