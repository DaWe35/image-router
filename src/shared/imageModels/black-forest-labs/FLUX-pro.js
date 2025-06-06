import { PRICING_TYPES } from '../../PricingScheme.js'

class FluxPro {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-pro',
      providers: [{
        id: 'deepinfra',
        model_name: 'black-forest-labs/FLUX-pro',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.05,
        }
      }],
      arena_score: 1069,
      release_date: '2024-08-01',
      examples: [
        {
          image: '/model-examples/FLUX-pro-2025-04-03T14-14-55-833Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default FluxPro 