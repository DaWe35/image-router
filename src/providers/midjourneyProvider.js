const { BaseProvider } = require('./baseProvider')
const { ApiError } = require('../utils/errors')

class MidjourneyProvider extends BaseProvider {
  constructor(config) {
    super(config)
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://api.midjourney.com/v1'
  }

  async generateImage(prompt, options = {}) {
    try {
      const {
        n = 1,
        size = '1024x1024',
        response_format = 'url'
      } = options

      // Midjourney only supports 1024x1024
      if (size !== '1024x1024') {
        throw new ApiError({
          statusCode: 400,
          type: 'validation_error',
          message: 'Midjourney only supports 1024x1024 image size'
        })
      }

      // Midjourney has a limit of 4 images per request
      if (n > 4) {
        throw new ApiError({
          statusCode: 400,
          type: 'validation_error',
          message: 'Midjourney only supports up to 4 images per request'
        })
      }

      const response = await fetch(`${this.baseUrl}/imagine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          prompt,
          n,
          size,
          quality: 'standard',
          style: 'vivid'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new ApiError({
          statusCode: response.status,
          type: 'provider_error',
          message: error.message || 'Failed to generate image with Midjourney',
          details: error
        })
      }

      const data = await response.json()
      const images = data.images.map(image => {
        if (response_format === 'b64_json') {
          return {
            b64_json: image.base64
          }
        }
        return {
          url: image.url
        }
      })

      return {
        created: Math.floor(Date.now() / 1000),
        data: images
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError({
        statusCode: 500,
        type: 'provider_error',
        message: 'Failed to generate image with Midjourney',
        details: error.message
      })
    }
  }
}

module.exports = MidjourneyProvider 