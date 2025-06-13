import { PRICING_TYPES } from '../../PricingScheme.js'

class Imagen4Ultra0520 {
  constructor() {
    this.data = {
      id: 'google/imagen-4-ultra-05-20',
      providers: [{
        id: 'vertex',
        model_name: 'imagen-4.0-ultra-generate-exp-05-20',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.08,
        }
      }],
      arena_score: 1105,
      release_date: '2025-05-20',
      examples: [
        {
          image: '/model-examples/imagen-4-ultra-2025-05-24T20-51-35-162Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Imagen4Ultra0520