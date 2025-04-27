import { PRICING_TYPES } from '../../PricingScheme.js'

class Flux11Pro {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1.1-pro',
      providers: [{
        name: 'deepinfra',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.04,
        }
      }],
      arenaScore: 1079,
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