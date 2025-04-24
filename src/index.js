import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { imageRoutes } from './routes/imageRoutes.js'
import { validateApiKey, logApiUsage } from './middleware/apiKeyMiddleware.js'
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

const imageGenerationLimiter = rateLimit({
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
        const { key } = res.locals
        return key.user.id
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

app.use(generalLimiter) // Apply general limiter to all other routes

// API key validation and usage logging
if (process.env.DATABASE_URL) {
    // Apply middleware chain for image generation: IP Limit -> Validate Key -> Key Limit -> Log Usage
    app.use(
        '/v1/openai/images/generations',
        imageGenerationLimiter, // First, limit by IP
        validateApiKey,         // Then, validate the API key
        userLimiter,          // Then, limit by API key
        logApiUsage             // Finally, log usage if all checks passed
    )
} else {
    app.use('/v1/openai/images/generations', imageGenerationLimiter)
}

// Modified IP endpoint to show headers for debugging
app.get('/ip', (request, response) => {
    const clientIp = request.headers['cf-connecting-ip'] || request.ip
    response.json({ ip: clientIp })
})

// Routes
app.use('/v1/openai/images', imageRoutes)

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