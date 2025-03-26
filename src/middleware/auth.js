const jwt = require('jsonwebtoken')
const { User, ApiKey } = require('../models')
const { ApiError } = require('../utils/errors')

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError({
        statusCode: 401,
        type: 'authentication_error',
        message: 'No API key provided'
      })
    }

    const apiKey = authHeader.split(' ')[1]
    const key = await ApiKey.findOne({
      where: {
        key: apiKey,
        isActive: true
      }
    })

    if (!key) {
      throw new ApiError({
        statusCode: 401,
        type: 'authentication_error',
        message: 'Invalid API key'
      })
    }

    if (key.expiresAt && key.expiresAt < new Date()) {
      throw new ApiError({
        statusCode: 401,
        type: 'authentication_error',
        message: 'API key has expired'
      })
    }

    req.apiKey = key
    next()
  } catch (error) {
    next(error)
  }
}

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.apiKey.userId)
    if (!user || user.role !== 'admin') {
      throw new ApiError({
        statusCode: 403,
        type: 'authorization_error',
        message: 'Admin privileges required'
      })
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { auth, isAdmin } 