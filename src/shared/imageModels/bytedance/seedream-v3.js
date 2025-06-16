import { PRICING_TYPES } from '../../PricingScheme.js'

class SeedreamV3 {
  constructor() {
    this.data = {
      id: 'bytedance/seedream-3',
      providers: [{
        id: 'fal',
        model_name: 'fal-ai/bytedance/seedream/v3/text-to-image',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.03,
        }
      }],
      release_date: '2025-04-16',
      arena_score: 1160,
      examples: [
        {
          image: '/model-examples/seedream-v3.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default SeedreamV3 