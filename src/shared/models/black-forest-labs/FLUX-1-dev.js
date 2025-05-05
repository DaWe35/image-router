import { PRICING_TYPES } from '../../PricingScheme.js'

class Flux1Dev {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1-dev',
      providers: [{
        id: 'deepinfra',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.009,
        }
      }],
      arena_score: 1042,
      release_date: '2024-08-01',
      examples: [
        {
          image: '/model-examples/FLUX-1-dev.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Flux1Dev 