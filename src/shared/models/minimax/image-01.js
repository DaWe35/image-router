import { PRICING_TYPES } from '../../PricingScheme.js'

class Image01 {
  constructor() {
    this.data = {
      id: 'minimax/image-01',
      providers: [{
        id: 'replicate',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.01,
        }
      }],
      arena_score: 1044,
      release_date: '2025-05-05',
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