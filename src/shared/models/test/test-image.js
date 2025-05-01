import { PRICING_TYPES } from '../../PricingScheme.js'

class TestImage {
  constructor() {
    this.data = {
      id: 'test/test',
      providers: [{
        id: 'test',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.00,
        },
        applyQuality: this.applyQuality,
        generate: this.generateRandomImage
      }],
      arenaScore: 0,
      examples: [
        {
          image: '/model-examples/test-image.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  applyQuality(params, quality) {
    // Simply store the quality parameter
    params.quality = quality
    return params
  }


}

export default TestImage 