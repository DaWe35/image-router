import { PRICING_TYPES } from '../../PricingScheme.js'

class Veo3 {
  constructor() {
    this.data = {
      id: 'google/veo-3',
      aliasOf: 'veo-3.0-generate-preview',
      providers: [{
        id: 'vertex',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 4, // price with no audio generated
        },
      }],
      arena_score: 1246,
      release_date: '2025-05-20',
      examples: [
        {
          video: '/model-examples/veo-3-2025-01-01T00-00-00-000Z.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Veo3 