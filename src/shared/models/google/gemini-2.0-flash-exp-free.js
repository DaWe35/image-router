import { PRICING_TYPES } from '../../PricingScheme.js'

class Gemini20FlashExpFree {
  constructor() {
    this.data = {
      id: 'google/gemini-2.0-flash-exp:free',
      aliasOf: 'google/gemini-2.0-flash-exp-image-generation',
      providers: [{
        id: 'google',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0,
        }
      }],
      arena_score: 966,
      examples: [
        {
          image: '/model-examples/gemini-2.0-flash-exp_free-2025-04-07T22-34-11-327Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Gemini20FlashExpFree 