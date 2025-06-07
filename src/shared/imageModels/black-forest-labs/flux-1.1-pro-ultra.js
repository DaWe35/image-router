import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

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
      size: {
        type: SIZE_TYPES.RANGE,
        min: "256x256",
        max: "2048x2048",
        default: "1024x1024"
      },
      arena_score: null,
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