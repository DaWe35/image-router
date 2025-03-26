const { logger } = require('../utils/logger')

const requestLogger = (req, res, next) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.id,
      apiKeyId: req.apiKey?.id
    })
  })

  next()
}

module.exports = {
  requestLogger
} 