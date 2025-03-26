class BaseProvider {
  constructor(config) {
    this.name = config.name
    this.priority = config.priority || 1
    this.rateLimit = config.rateLimit || 60
    this.costPerImage = config.costPerImage || 0
    this.supportedSizes = config.supportedSizes || ['1024x1024']
    this.maxImagesPerRequest = config.maxImagesPerRequest || 10
    this.timeout = config.timeout || 30000
    this.isActive = config.isActive !== false
  }

  async generateImage(prompt, options = {}) {
    throw new Error('generateImage method must be implemented by provider')
  }

  validateOptions(options) {
    const {
      n = 1,
      size = '1024x1024',
      response_format = 'url'
    } = options

    if (n < 1 || n > this.maxImagesPerRequest) {
      throw new Error(`Number of images must be between 1 and ${this.maxImagesPerRequest}`)
    }

    if (!this.supportedSizes.includes(size)) {
      throw new Error(`Unsupported image size. Supported sizes: ${this.supportedSizes.join(', ')}`)
    }

    if (!['url', 'b64_json'].includes(response_format)) {
      throw new Error('Response format must be either "url" or "b64_json"')
    }

    return true
  }

  calculateCost(n) {
    return this.costPerImage * n
  }

  isAvailable() {
    return this.isActive
  }

  getPriority() {
    return this.priority
  }

  getRateLimit() {
    return this.rateLimit
  }

  getTimeout() {
    return this.timeout
  }
}

module.exports = {
  BaseProvider
} 