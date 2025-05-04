import { PRICING_TYPES } from '../../PricingScheme.js'

class RecraftV3 {
  constructor() {
    this.data = {
      id: 'recraft-ai/recraft-v3',
      providers: [{
        id: 'replicate',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.04,
        }
      }],
      arena_score: 1105,
      examples: [
        {
          image: '/model-examples/recraft-v3-2025-04-03T15-09-40-800Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default RecraftV3 