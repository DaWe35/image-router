import { PRICING_TYPES } from '../../PricingScheme.js'

class Flux1Schnell {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1-schnell',
      providers: [{
        id: 'deepinfra',
        model_name: 'black-forest-labs/FLUX-1-schnell',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.0005,
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
}

export default Flux1Schnell 