import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class Flux1Dev {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1-dev',
      providers: [{
        id: 'deepinfra',
        model_name: 'black-forest-labs/FLUX-1-dev',
        pricing: {
          type: PRICING_TYPES.CALCULATED,
          calcFunction: this.calculatePrice,
          range: {
            min: this.calculatePrice('low', '128x128'),
            average: this.calculatePrice('medium', '1024x1024'),
            max: this.calculatePrice('high', '1920x1920')
          }
        }
      }],
      size: {
        type: SIZE_TYPES.RANGE,
        min: "128x128",
        max: "1920x1920",
        default: "1024x1024"
      },
      arena_score: 1046,
      release_date: '2024-08-01',
      examples: [
        {
          image: '/model-examples/FLUX-1-dev.webp'
        }
      ]
    }
  }

  calculatePrice(quality, size) {
    // $0.009 x (width / 1024) x (height / 1024) x (iters / 25)
    // https://deepinfra.com/black-forest-labs/FLUX-1-dev/pricing
    const width = size.split('x')[0]
    const height = size.split('x')[1]
    const iters = 25 // fixed at 25 for now
    return 0.009 * (width / 1024) * (height / 1024) * (iters / 25)
  }

  getData() {
    return this.data
  }
}

export default Flux1Dev 