import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class Sd35Medium {
  constructor() {
    this.data = {
      id: 'stabilityai/sd3.5-medium',
      providers: [{
        id: 'deepinfra',
        model_name: 'stabilityai/sd3.5-medium',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.03,
        }
      }],
      arena_score: 928,
      release_date: '2024-10-22',
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