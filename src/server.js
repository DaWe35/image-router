const app = require('./app')
const { sequelize } = require('./models')
const { logger } = require('./utils/logger')

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate()
    logger.info('Database connection established successfully')

    // Sync database models
    await sequelize.sync()
    logger.info('Database models synchronized')

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer() 