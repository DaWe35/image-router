import { PRICING_TYPES } from '../../PricingScheme.js'

class Veo2 {
  constructor() {
    this.data = {
      id: 'google/veo-2',
      providers: [{
        id: 'gemini',
        model_name: 'veo-2.0-generate-001',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 1.75,
        },
      }],
      arena_score: 1132,
      release_date: '2024-12-16',
      examples: [
        {
          video: '/model-examples/veo-2-2025-05-27T22-57-10-794Z.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Veo2 