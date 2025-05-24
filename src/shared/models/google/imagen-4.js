import { PRICING_TYPES } from '../../PricingScheme.js'

class Imagen4 {
  constructor() {
    this.data = {
      id: 'google/imagen-4',
      aliasOf: 'imagen-4.0-generate-preview-05-20',
      providers: [{
        id: 'vertex',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.05,
        }
      }],
      arena_score: 1092,
      examples: [
        {
          image: '/model-examples/imagen-4-2025-05-24T20-46-43-888Z'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Imagen4 