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

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

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
    console.log(`Server running on port ${port}`)
}) 