import { PRICING_TYPES } from '../../PricingScheme.js'

class Kling16Standard {
  constructor() {
    this.data = {
      id: 'kwaivgi/kling-1.6-standard',
      providers: [{
        id: 'replicate',
        model_name: 'kwaivgi/kling-v1.6-standard',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.25, // price per video on Replicate
        },
      }],
      arena_score: 1029,
      release_date: '2024-12-19',
      examples: [
        {
          image: '/model-examples/kling-1.6-standard.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Kling16Standard 