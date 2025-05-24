import { PRICING_TYPES } from '../../PricingScheme.js'

class Imagen3 {
  constructor() {
    this.data = {
      id: 'google/imagen-3',
      aliasOf: 'imagen-3.0-generate-002', // Use the latest version as default
      providers: [{
        id: 'vertex',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.04,
        }
      }],
      arena_score: 1092,
      examples: [
        {
          image: '/model-examples/imagen-3-2025-04-03T15-11-15-706Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Imagen3 