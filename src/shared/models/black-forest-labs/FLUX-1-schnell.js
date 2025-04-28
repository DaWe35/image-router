import { PRICING_TYPES } from '../../PricingScheme.js'

class Flux1Schnell {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1-schnell',
      providers: [{
        id: 'deepinfra',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.0005,
        }
      }],
      arenaScore: 1000,
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