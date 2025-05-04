import { PRICING_TYPES } from '../../PricingScheme.js'

class Imagen3Fast {
  constructor() {
    this.data = {
      id: 'google/imagen-3-fast',
      providers: [{
        id: 'replicate',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.025,
        }
      }],
      arena_score: null,
      examples: [
        {
          image: '/model-examples/imagen-3-fast-2025-04-03T15-11-16-597Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Imagen3Fast 