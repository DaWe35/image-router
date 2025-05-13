import { PRICING_TYPES } from '../../PricingScheme.js'

class Flux11Pro {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1.1-pro',
      providers: [{
        id: 'deepinfra',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.04,
        }
      }],
      arena_score: 1082,
      release_date: '2024-11-02',
      examples: [
        {
          image: '/model-examples/FLUX-1.1-pro.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Flux11Pro 