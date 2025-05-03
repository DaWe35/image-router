import { PRICING_TYPES } from '../../PricingScheme.js'

class IdeogramV2a {
  constructor() {
    this.data = {
      id: 'ideogram-ai/ideogram-v2a',
      providers: [{
        id: 'replicate',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.04,
        }
      }],
      arena_score: 997,
      examples: [
        {
          image: '/model-examples/ideogram-v2a-2025-04-03T15-10-14-620Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default IdeogramV2a 