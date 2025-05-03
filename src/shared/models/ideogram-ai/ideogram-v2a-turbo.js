import { PRICING_TYPES } from '../../PricingScheme.js'

class IdeogramV2aTurbo {
  constructor() {
    this.data = {
      id: 'ideogram-ai/ideogram-v2a-turbo',
      providers: [{
        id: 'replicate',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.025,
        }
      }],
      arena_score: 991,
      examples: [
        {
          image: '/model-examples/ideogram-v2a-turbo-2025-04-03T15-10-09-820Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default IdeogramV2aTurbo 