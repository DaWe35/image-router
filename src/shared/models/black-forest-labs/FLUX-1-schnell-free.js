import { PRICING_TYPES } from '../../PricingScheme.js'

class Flux1SchnellFree {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1-schnell:free',
      providers: [{
        id: 'deepinfra',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0,
        }
      }],
      arena_score: 1000,
      release_date: '2024-08-01',
      examples: [
        {
          image: '/model-examples/FLUX-1-schnell.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  getModelToUse(quality) {
    return 'black-forest-labs/FLUX-1-schnell'
  }
}

export default Flux1SchnellFree 