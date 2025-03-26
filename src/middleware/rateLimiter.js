const rateLimit = require('express-rate-limit')
const { ApiError } = require('../utils/errors')

const rateLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      type: 'rate_limit_exceeded',
      message: 'Too many requests, please try again later.'
    }
  },
  handler: (req, res, next) => {
    next(new ApiError({
      statusCode: 429,
      type: 'rate_limit_exceeded',
      message: 'Too many requests, please try again later.'
    }))
  }
})

module.exports = {
  rateLimiter
} 