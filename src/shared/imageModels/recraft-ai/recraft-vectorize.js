import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyFalImage } from '../../applyImage.js'

class RecraftVectorize {
  constructor() {
    this.data = {
      id: 'recraft-ai/recraft-vectorize',
      providers: [{
        id: 'fal',
        model_name: 'fal-ai/recraft/vectorize',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.01
        },
        applyImage: applyFalImage
      }],
      release_date: '2024-10-30',
      examples: [
        {
          image: '/model-examples/recraft-vectorize-compressed-2025-06-24T13-39-45-891Z.svg'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default RecraftVectorize