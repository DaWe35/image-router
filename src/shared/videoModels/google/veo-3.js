import { PRICING_TYPES } from '../../PricingScheme.js'

class Veo3 {
  constructor() {
    this.data = {
      id: 'google/veo-3',
      providers: [{
        id: 'replicate',
        model_name: 'google/veo-3',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 6, // price per video on Replicate
        },
      }],
      arena_score: 1246,
      release_date: '2025-05-20',
      examples: [
        {
          video: '/model-examples/veo-3.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Veo3 