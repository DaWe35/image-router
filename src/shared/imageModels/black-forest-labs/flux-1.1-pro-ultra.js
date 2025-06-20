import { PRICING_TYPES } from '../../PricingScheme.js'

class Flux11ProUltra {
  constructor() {
    this.data = {
      id: 'black-forest-labs/flux-1.1-pro-ultra',
      providers: [{
        id: 'replicate',
        model_name: 'black-forest-labs/flux-1.1-pro-ultra',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.06,
        }
      }],
      arena_score: 1094,
      release_date: '2024-11-06',
      examples: [
        {
          image: '/model-examples/flux-1.1-pro-ultra-2025-04-03T15-49-06-132Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Flux11ProUltra 