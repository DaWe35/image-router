const { Provider } = require('../models')
const ProviderFactory = require('../providers/providerFactory')
const { ApiError } = require('../utils/errors')

class ProviderService {
  constructor() {
    this.providers = new Map()
    this.loadProviders()
  }

  async loadProviders() {
    try {
      const providers = await Provider.findAll({
        where: { isActive: true },
        order: [['priority', 'ASC']]
      })

      this.providers.clear()
      for (const provider of providers) {
        const providerInstance = ProviderFactory.createProvider(provider.type, {
          name: provider.name,
          apiKey: provider.apiKey,
          baseUrl: provider.baseUrl,
          priority: provider.priority,
          rateLimit: provider.rateLimit,
          costPerImage: provider.costPerImage,
          supportedSizes: provider.supportedSizes,
          maxImagesPerRequest: provider.maxImagesPerRequest,
          timeout: provider.timeout,
          isActive: provider.isActive
        })
        this.providers.set(provider.id, providerInstance)
      }
    } catch (error) {
      console.error('Failed to load providers:', error)
    }
  }

  async getAvailableProviders() {
    return Array.from(this.providers.values())
      .filter(provider => provider.isAvailable())
      .sort((a, b) => a.getPriority() - b.getPriority())
  }

  async generateImage(prompt, options = {}) {
    const availableProviders = await this.getAvailableProviders()
    if (availableProviders.length === 0) {
      throw new ApiError({
        statusCode: 503,
        type: 'service_unavailable',
        message: 'No image generation providers available'
      })
    }

    let lastError = null
    for (const provider of availableProviders) {
      try {
        provider.validateOptions(options)
        const result = await provider.generateImage(prompt, options)
        return {
          ...result,
          provider: provider.name,
          cost: provider.calculateCost(options.n || 1)
        }
      } catch (error) {
        lastError = error
        console.error(`Provider ${provider.name} failed:`, error)
        continue
      }
    }

    throw lastError || new ApiError({
      statusCode: 500,
      type: 'provider_error',
      message: 'All providers failed to generate image'
    })
  }

  async getProviderInfo(providerId) {
    const provider = this.providers.get(providerId)
    if (!provider) {
      throw new ApiError({
        statusCode: 404,
        type: 'not_found',
        message: 'Provider not found'
      })
    }

    return {
      name: provider.name,
      priority: provider.getPriority(),
      rateLimit: provider.getRateLimit(),
      costPerImage: provider.costPerImage,
      supportedSizes: provider.supportedSizes,
      maxImagesPerRequest: provider.maxImagesPerRequest,
      timeout: provider.getTimeout(),
      isActive: provider.isAvailable()
    }
  }

  async reloadProviders() {
    await this.loadProviders()
  }
}

module.exports = new ProviderService() 