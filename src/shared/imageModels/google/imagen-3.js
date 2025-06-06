import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class Imagen3 {
  constructor() {
    this.data = {
      id: 'google/imagen-3',
      providers: [{
        id: 'vertex',
        model_name: 'imagen-3.0-generate-002',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.04,
        }
      }],
      size: {
        type: SIZE_TYPES.RANGE,
        min: "256x256",
        max: "1536x1536",
        default: "1024x1024"
      },
      arena_score: 1092,
      release_date: '2024-12-16',
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