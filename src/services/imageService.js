const { ImageRequest, User, ApiKey } = require('../models')
const providerService = require('./providerService')
const { ApiError } = require('../utils/errors')
const { Op } = require('sequelize')
const sequelize = require('sequelize')

class ImageService {
  async generateImage(userId, apiKeyId, prompt, options = {}) {
    try {
      // Create image request record
      const imageRequest = await ImageRequest.create({
        userId,
        apiKeyId,
        prompt,
        status: 'pending',
        options: JSON.stringify(options)
      })

      // Get user and API key for rate limiting and billing
      const [user, apiKey] = await Promise.all([
        User.findByPk(userId),
        ApiKey.findByPk(apiKeyId)
      ])

      if (!user || !apiKey) {
        throw new ApiError({
          statusCode: 404,
          type: 'not_found',
          message: 'User or API key not found'
        })
      }

      // Generate image using provider service
      const result = await providerService.generateImage(prompt, options)

      // Update image request record
      await imageRequest.update({
        status: 'completed',
        provider: result.provider,
        cost: result.cost,
        result: JSON.stringify(result)
      })

      return {
        id: imageRequest.id,
        status: 'completed',
        created: result.created,
        data: result.data
      }
    } catch (error) {
      // Update image request record with error
      if (imageRequest) {
        await imageRequest.update({
          status: 'failed',
          error: error.message
        })
      }

      throw error
    }
  }

  async getImageStatus(imageId, userId) {
    const imageRequest = await ImageRequest.findOne({
      where: { id: imageId, userId }
    })

    if (!imageRequest) {
      throw new ApiError({
        statusCode: 404,
        type: 'not_found',
        message: 'Image request not found'
      })
    }

    if (imageRequest.status === 'completed') {
      const result = JSON.parse(imageRequest.result)
      return {
        id: imageRequest.id,
        status: 'completed',
        created: result.created,
        data: result.data
      }
    }

    if (imageRequest.status === 'failed') {
      throw new ApiError({
        statusCode: 500,
        type: 'provider_error',
        message: imageRequest.error
      })
    }

    return {
      id: imageRequest.id,
      status: 'pending',
      created: imageRequest.createdAt
    }
  }

  async listImages(userId, options = {}) {
    const {
      limit = 10,
      offset = 0,
      status
    } = options

    const where = { userId }
    if (status) {
      where.status = status
    }

    const [imageRequests, total] = await Promise.all([
      ImageRequest.findAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      }),
      ImageRequest.count({ where })
    ])

    const images = imageRequests.map(request => {
      const result = request.status === 'completed' ? JSON.parse(request.result) : null
      return {
        id: request.id,
        status: request.status,
        created: result ? result.created : request.createdAt,
        data: result ? result.data : null,
        cost: request.cost,
        provider: request.provider
      }
    })

    return {
      data: images,
      total,
      limit,
      offset
    }
  }

  async getImageStats(userId) {
    const stats = await ImageRequest.findAll({
      where: { userId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    })

    const totalCost = await ImageRequest.sum('cost', {
      where: { userId, status: 'completed' }
    })

    return {
      stats: stats.reduce((acc, stat) => {
        acc[stat.status] = parseInt(stat.get('count'))
        return acc
      }, {}),
      totalCost: totalCost || 0
    }
  }
}

module.exports = new ImageService() 