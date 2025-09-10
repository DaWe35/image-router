import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyFalImage } from '../../applyImage.js'

class RecraftV3 {
  constructor() {
    this.data = {
      id: 'recraft-ai/recraft-v3',
      providers: [{
        id: 'fal',
        model_name: 'fal-ai/recraft/v3/text-to-image',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.04,
        },
        applyImage: applyFalImage
      }],
      arena_score: 1114,
      release_date: '2024-10-30',
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