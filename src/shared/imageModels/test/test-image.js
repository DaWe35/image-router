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
        applyImage: this.applyImage,
        applyMask: this.applyMask,
      }],
      arena_score: null,
      release_date: '2025-05-04',
      examples: [
        {
          image: '/model-examples/test.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  applyQuality(params) {
    // Change nothing, values are already valited in validateParams.js
    return params
  }

  applyImage(params) {
    // Change nothing, values are already valited in validateParams.js
    return params
  }

  applyMask(params) {
    // Change nothing, values are already valited in validateParams.js
    return params
  }
}

export default TestImage 