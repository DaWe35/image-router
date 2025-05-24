import { PRICING_TYPES } from '../../PricingScheme.js'

class Imagen4Ultra {
  constructor() {
    this.data = {
      id: 'google/imagen-4-ultra',
      aliasOf: 'imagen-4.0-ultra-generate-exp-05-20',
      providers: [{
        id: 'vertex',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.12,
        }
      }],
      arena_score: 1105,
      examples: [
        {
          image: '/model-examples/imagen-4-ultra-2025-05-24T20-51-35-162Z'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Imagen4Ultra 