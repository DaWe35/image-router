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
app.set('trust proxy', true)

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Rate limiting configurations
const generalLimiter = rateLimit({
    windowMs: 1 * 1000, // 1 seconds
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: {
            message: 'Too many requests, please try again later.',
            type: 'rate_limit_error'
        }
    }
})

const imageGenerationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 requests per minute
    message: {
        error: {
            message: 'Too many image generation requests, please try again later.',
            type: 'rate_limit_error'
        }
    }
})

// Apply rate limiting to specific routes
app.use('/v1/openai/images/generations', imageGenerationLimiter)
app.use(generalLimiter) // Apply general limiter to all other routes

// API key validation and usage logging
if (process.env.DATABASE_URL) {
    app.use('/v1/openai/images/generations', validateApiKey, logApiUsage)
}

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