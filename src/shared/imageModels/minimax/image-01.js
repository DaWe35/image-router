import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class Image01 {
  constructor() {
    this.data = {
      id: 'minimax/image-01',
      providers: [{
        id: 'replicate',
        model_name: 'minimax/image-01',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.01,
        }
      }],
      size: {
        type: SIZE_TYPES.RANGE,
        min: "256x256",
        max: "1536x1536",
        default: "1024x1024"
      },
      arena_score: 1049,
      release_date: '2025-03-05',
      examples: [
        {
          image: '/model-examples/image-01.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Image01 