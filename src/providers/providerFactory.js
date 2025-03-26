const OpenAiProvider = require('./openAiProvider')
const StabilityProvider = require('./stabilityProvider')
const MidjourneyProvider = require('./midjourneyProvider')

class ProviderFactory {
  static createProvider(type, config) {
    switch (type.toLowerCase()) {
      case 'openai':
        return new OpenAiProvider(config)
      case 'stability':
        return new StabilityProvider(config)
      case 'midjourney':
        return new MidjourneyProvider(config)
      default:
        throw new Error(`Unsupported provider type: ${type}`)
    }
  }

  static getProviderTypes() {
    return [
      {
        type: 'openai',
        name: 'OpenAI',
        description: 'OpenAI DALL-E image generation API',
        supportedSizes: ['256x256', '512x512', '1024x1024'],
        maxImagesPerRequest: 10
      },
      {
        type: 'stability',
        name: 'Stability AI',
        description: 'Stability AI image generation API',
        supportedSizes: ['512x512', '768x768', '1024x1024'],
        maxImagesPerRequest: 10
      },
      {
        type: 'midjourney',
        name: 'Midjourney',
        description: 'Midjourney image generation API',
        supportedSizes: ['1024x1024'],
        maxImagesPerRequest: 4
      }
    ]
  }
}

module.exports = ProviderFactory 