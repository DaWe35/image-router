import { PRICING_TYPES } from '../../PricingScheme.js'

class Imagen3 {
  constructor() {
    this.data = {
      id: 'google/imagen-3',
      providers: [{
        name: 'replicate',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.05,
        }
      }],
      arenaScore: 1084,
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