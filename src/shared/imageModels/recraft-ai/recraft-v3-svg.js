import { PRICING_TYPES } from '../../PricingScheme.js'

class RecraftV3Svg {
  constructor() {
    this.data = {
      id: 'recraft-ai/recraft-v3-svg',
      providers: [{
        id: 'replicate',
        model_name: 'recraft-ai/recraft-v3-svg',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.08,
        }
      }],
      arena_score: null,
      release_date: '2024-10-30',
      examples: [
        {
          image: '/model-examples/recraft-v3-svg-2025-04-03T15-34-40-865Z.svg'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default RecraftV3Svg 