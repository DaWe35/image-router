const Joi = require('joi')
const { ApiError } = require('../utils/errors')

const imageRequestSchema = Joi.object({
  prompt: Joi.string().required().max(1000),
  n: Joi.number().integer().min(1).max(10).default(1),
  size: Joi.string().valid('256x256', '512x512', '1024x1024').default('1024x1024'),
  response_format: Joi.string().valid('url', 'b64_json').default('url'),
  user: Joi.string().max(256)
})

const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().required().max(100)
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

const profileUpdateSchema = Joi.object({
  name: Joi.string().max(100),
  email: Joi.string().email()
})

const apiKeyCreationSchema = Joi.object({
  name: Joi.string().required().max(100),
  rateLimit: Joi.number().integer().min(1).default(100),
  rateLimitWindow: Joi.number().integer().min(1000).default(900000),
  expiresAt: Joi.date().iso().greater('now')
})

const apiKeyUpdateSchema = Joi.object({
  name: Joi.string().max(100),
  isActive: Joi.boolean(),
  rateLimit: Joi.number().integer().min(1),
  rateLimitWindow: Joi.number().integer().min(1000),
  expiresAt: Joi.date().iso().greater('now')
})

const providerCreationSchema = Joi.object({
  name: Joi.string().required().max(100),
  apiKey: Joi.string().required(),
  baseUrl: Joi.string().uri().required(),
  priority: Joi.number().integer().min(1).default(1),
  rateLimit: Joi.number().integer().min(1).default(60),
  costPerImage: Joi.number().precision(6).min(0).required(),
  supportedSizes: Joi.array().items(Joi.string().valid('256x256', '512x512', '1024x1024')).required(),
  maxImagesPerRequest: Joi.number().integer().min(1).default(10),
  timeout: Joi.number().integer().min(1000).default(30000)
})

const providerUpdateSchema = Joi.object({
  name: Joi.string().max(100),
  apiKey: Joi.string(),
  baseUrl: Joi.string().uri(),
  priority: Joi.number().integer().min(1),
  rateLimit: Joi.number().integer().min(1),
  costPerImage: Joi.number().precision(6).min(0),
  supportedSizes: Joi.array().items(Joi.string().valid('256x256', '512x512', '1024x1024')),
  maxImagesPerRequest: Joi.number().integer().min(1),
  timeout: Joi.number().integer().min(1000)
})

const validateImageRequest = (req, res, next) => {
  const { error } = imageRequestSchema.validate(req.body)
  if (error) {
    throw new ApiError({
      statusCode: 400,
      type: 'validation_error',
      message: 'Invalid request parameters',
      details: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    })
  }
  next()
}

const validateRegistration = (req, res, next) => {
  const { error } = registrationSchema.validate(req.body)
  if (error) {
    throw new ApiError({
      statusCode: 400,
      type: 'validation_error',
      message: 'Invalid registration data',
      details: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    })
  }
  next()
}

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body)
  if (error) {
    throw new ApiError({
      statusCode: 400,
      type: 'validation_error',
      message: 'Invalid login data',
      details: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    })
  }
  next()
}

const validateProfileUpdate = (req, res, next) => {
  const { error } = profileUpdateSchema.validate(req.body)
  if (error) {
    throw new ApiError({
      statusCode: 400,
      type: 'validation_error',
      message: 'Invalid profile update data',
      details: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    })
  }
  next()
}

const validateApiKeyCreation = (req, res, next) => {
  const { error } = apiKeyCreationSchema.validate(req.body)
  if (error) {
    throw new ApiError({
      statusCode: 400,
      type: 'validation_error',
      message: 'Invalid API key data',
      details: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    })
  }
  next()
}

const validateApiKeyUpdate = (req, res, next) => {
  const { error } = apiKeyUpdateSchema.validate(req.body)
  if (error) {
    throw new ApiError({
      statusCode: 400,
      type: 'validation_error',
      message: 'Invalid API key update data',
      details: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    })
  }
  next()
}

const validateProviderCreation = (req, res, next) => {
  const { error } = providerCreationSchema.validate(req.body)
  if (error) {
    throw new ApiError({
      statusCode: 400,
      type: 'validation_error',
      message: 'Invalid provider data',
      details: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    })
  }
  next()
}

const validateProviderUpdate = (req, res, next) => {
  const { error } = providerUpdateSchema.validate(req.body)
  if (error) {
    throw new ApiError({
      statusCode: 400,
      type: 'validation_error',
      message: 'Invalid provider update data',
      details: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    })
  }
  next()
}

module.exports = {
  validateImageRequest,
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateApiKeyCreation,
  validateApiKeyUpdate,
  validateProviderCreation,
  validateProviderUpdate
} 