import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class Flux1Schnell {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1-schnell',
      providers: [{
        id: 'deepinfra',
        model_name: 'black-forest-labs/FLUX-1-schnell',
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
      arena_score: 1000,
      release_date: '2024-08-01',
      examples: [
        {
          image: '/model-examples/FLUX-1-schnell.webp'
        }
      ]
    }
  }

  calculatePrice(quality, size) {
    // $0.0005 x (width / 1024) x (height / 1024) x iters
    // https://deepinfra.com/black-forest-labs/FLUX-1-schnell/pricing
    const width = size.split('x')[0]
    const height = size.split('x')[1]
    const iters = 1 // fixed at 1 for now
    return 0.0005 * (width / 1024) * (height / 1024) * iters
  }

  getData() {
    return this.data
  }
}

export default Flux1Schnell 