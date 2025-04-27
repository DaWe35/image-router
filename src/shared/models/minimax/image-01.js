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
      arenaScore: 1044,
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