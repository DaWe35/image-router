const { ApiKey } = require('../../models')
const { ApiError } = require('../../utils/errors')

const createApiKey = async (req, res, next) => {
  try {
    const { name, rateLimit, rateLimitWindow, expiresAt } = req.body
    const userId = req.user.id

    const apiKey = await ApiKey.create({
      name,
      rateLimit,
      rateLimitWindow,
      expiresAt,
      userId
    })

    res.status(201).json({
      id: apiKey.id,
      name: apiKey.name,
      key: apiKey.key,
      rateLimit: apiKey.rateLimit,
      rateLimitWindow: apiKey.rateLimitWindow,
      expiresAt: apiKey.expiresAt,
      createdAt: apiKey.createdAt
    })
  } catch (error) {
    next(error)
  }
}

const listApiKeys = async (req, res, next) => {
  try {
    const userId = req.user.id

    const apiKeys = await ApiKey.findAll({
      where: { userId },
      attributes: { exclude: ['key'] },
      order: [['createdAt', 'DESC']]
    })

    res.json(apiKeys)
  } catch (error) {
    next(error)
  }
}

const updateApiKey = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const updateData = req.body

    const apiKey = await ApiKey.findOne({
      where: {
        id,
        userId
      }
    })

    if (!apiKey) {
      throw new ApiError({
        statusCode: 404,
        type: 'not_found',
        message: 'API key not found'
      })
    }

    await apiKey.update(updateData)

    res.json({
      id: apiKey.id,
      name: apiKey.name,
      rateLimit: apiKey.rateLimit,
      rateLimitWindow: apiKey.rateLimitWindow,
      expiresAt: apiKey.expiresAt,
      isActive: apiKey.isActive,
      lastUsedAt: apiKey.lastUsedAt
    })
  } catch (error) {
    next(error)
  }
}

const deleteApiKey = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const apiKey = await ApiKey.findOne({
      where: {
        id,
        userId
      }
    })

    if (!apiKey) {
      throw new ApiError({
        statusCode: 404,
        type: 'not_found',
        message: 'API key not found'
      })
    }

    await apiKey.destroy()

    res.json({ message: 'API key deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createApiKey,
  listApiKeys,
  updateApiKey,
  deleteApiKey
} 