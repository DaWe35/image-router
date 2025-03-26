require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const { sequelize } = require('./models')
const { errorHandler } = require('./middleware/errorHandler')
const { requestLogger } = require('./middleware/requestLogger')
const { rateLimiter } = require('./middleware/rateLimiter')

// Import routes
const userRoutes = require('./api/routes/userRoutes')
const apiKeyRoutes = require('./api/routes/apiKeyRoutes')
const providerRoutes = require('./api/routes/providerRoutes')
const imageRoutes = require('./api/routes/imageRoutes')

const app = express()

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined'))
app.use(requestLogger)
app.use(rateLimiter)

// Routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/keys', apiKeyRoutes)
app.use('/api/v1/providers', providerRoutes)
app.use('/api/v1/images', imageRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

// Error handling
app.use(errorHandler)

// Database connection and server start
const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connection established successfully.')
    
    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true })
      console.log('Database synced.')
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Unable to start server:', error)
    process.exit(1)
  }
}

startServer()

module.exports = app 