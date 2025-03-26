const { ValidationError } = require('sequelize')
const { ApiError } = require('../utils/errors')

const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  // Handle Sequelize validation errors
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: {
        type: 'validation_error',
        message: 'Validation failed',
        details: err.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      }
    })
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        type: err.type,
        message: err.message,
        details: err.details
      }
    })
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: {
        type: 'authentication_error',
        message: 'Invalid token'
      }
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: {
        type: 'authentication_error',
        message: 'Token expired'
      }
    })
  }

  // Handle rate limit errors
  if (err.name === 'RateLimitExceeded') {
    return res.status(429).json({
      error: {
        type: 'rate_limit_error',
        message: 'Too many requests',
        details: {
          retryAfter: err.retryAfter
        }
      }
    })
  }

  // Default error
  return res.status(500).json({
    error: {
      type: 'internal_server_error',
      message: 'An unexpected error occurred'
    }
  })
}

module.exports = { errorHandler } 