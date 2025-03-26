const { BaseProvider } = require('./baseProvider')
const { ApiError } = require('../utils/errors')

class StabilityProvider extends BaseProvider {
  constructor(config) {
    super(config)
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://api.stability.ai'
  }

  async generateImage(prompt, options = {}) {
    try {
      const {
        n = 1,
        size = '1024x1024',
        response_format = 'url'
      } = options

      const [width, height] = size.split('x').map(Number)
      const engineId = this.getEngineId(width, height)

      const response = await fetch(`${this.baseUrl}/v1/generation/${engineId}/text-to-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            },
            {
              text: 'blurry, bad quality, distorted, deformed',
              weight: -1
            }
          ],
          cfg_scale: 7,
          height,
          width,
          samples: n,
          steps: 30
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new ApiError({
          statusCode: response.status,
          type: 'provider_error',
          message: error.message || 'Failed to generate image with Stability AI',
          details: error
        })
      }

      const data = await response.json()
      const images = data.artifacts.map(artifact => {
        if (response_format === 'b64_json') {
          return {
            b64_json: artifact.base64
          }
        }
        return {
          url: `data:image/png;base64,${artifact.base64}`
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
        message: 'Failed to generate image with Stability AI',
        details: error.message
      })
    }
  }

  getEngineId(width, height) {
    // Stability AI has different engines for different sizes
    if (width === 512 && height === 512) {
      return 'stable-diffusion-512-v2-1'
    }
    if (width === 768 && height === 768) {
      return 'stable-diffusion-768-v2-1'
    }
    if (width === 1024 && height === 1024) {
      return 'stable-diffusion-xl-1024-v1-0'
    }
    throw new ApiError({
      statusCode: 400,
      type: 'validation_error',
      message: 'Unsupported image size for Stability AI'
    })
  }
}

module.exports = StabilityProvider 