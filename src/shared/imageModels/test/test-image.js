import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class TestImage {
  constructor() {
    this.data = {
      id: 'test/test',
      providers: [{
        id: 'test',
        model_name: 'test/test',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.00,
        },
        applyQuality: this.applyQuality,
        applyImage: this.applyImage,
        applyMask: this.applyMask,
      }],
      /* size: {
        type: SIZE_TYPES.RANGE,
        min: "256x256",
        max: "2048x2048",
        default: "1024x1024"
      }, */
      arena_score: 0,
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