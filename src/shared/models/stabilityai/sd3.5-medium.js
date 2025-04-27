import { PRICING_TYPES } from '../../PricingScheme.js'

class Sd35Medium {
  constructor() {
    this.data = {
      id: 'stabilityai/sd3.5-medium',
      providers: [{
        name: 'deepinfra',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.03,
        }
      }],
      arenaScore: 935,
      examples: [
        {
          image: '/model-examples/sd3.5-medium.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Sd35Medium 