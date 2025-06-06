import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class Imagen4 {
  constructor() {
    this.data = {
      id: 'google/imagen-4',
      providers: [{
        id: 'vertex',
        model_name: 'imagen-4.0-generate-preview-05-20',
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
      release_date: '2025-05-20',
      examples: [
        {
          image: '/model-examples/imagen-4-2025-05-24T20-46-43-888Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Imagen4 