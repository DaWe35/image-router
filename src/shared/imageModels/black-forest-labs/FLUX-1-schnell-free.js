import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class Flux1SchnellFree {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1-schnell:free',
      providers: [{
        id: 'deepinfra',
        model_name: 'black-forest-labs/FLUX-1-schnell',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0,
        },
      }],
      size: {
        type: SIZE_TYPES.RANGE,
        min: "128x128",
        max: "1024x1024",
        default: "1024x1024"
      },
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

export default Flux1SchnellFree 