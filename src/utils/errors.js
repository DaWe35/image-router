class ApiError extends Error {
  constructor({ statusCode, type, message, details = null }) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.type = type
    this.details = details
    Error.captureStackTrace(this, this.constructor)
  }
}

const errorHandler = (err, req, res, next) => {
  const logger = require('./logger').logger

  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    details: err.details,
    path: req.path,
    method: req.method,
    ip: req.ip
  })

  // Handle API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        type: err.type,
        message: err.message,
        details: err.details
      }
    })
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        type: 'validation_error',
        message: 'Validation failed',
        details: err.errors
      }
    })
  }

  // Handle database errors
  if (err.name === 'SequelizeError') {
    return res.status(500).json({
      success: false,
      error: {
        type: 'database_error',
        message: 'Database operation failed',
        details: err.message
      }
    })
  }

  // Handle unknown errors
  return res.status(500).json({
    success: false,
    error: {
      type: 'internal_server_error',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : null
    }
  })
}

module.exports = {
  ApiError,
  errorHandler
} 