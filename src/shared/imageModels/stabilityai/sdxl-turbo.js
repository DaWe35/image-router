import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class SdxlTurbo {
  constructor() {
    this.data = {
      id: 'stabilityai/sdxl-turbo',
      providers: [
        {
          id: 'deepinfra',
          model_name: 'stabilityai/sdxl-turbo',
          pricing: {
            type: PRICING_TYPES.CALCULATED,
            calcFunction: this.calculatePrice,
            range: {
              min: this.calculatePrice('low', '128x128'),
              average: this.calculatePrice('medium', '1024x1024'),
              max: this.calculatePrice('high', '1920x1920')
            }
          }
        },
        /* {
          name: 'replicate',
          providerModelId: 'stability-ai/stable-diffusion-3.5-large-turbo',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.04,
          }
        } */
    ],
      size: {
        type: SIZE_TYPES.RANGE,
        min: "128x128",
        max: "1920x1920",
        default: "1024x1024"
      },
      arena_score: 1031,
      release_date: '2024-10-22',
      examples: [
        {
          image: '/model-examples/sdxl-turbo.webp'
        }
      ]
    }
  }

  calculatePrice(quality, size) {
    // $0.0002 x (width / 1024) x (height / 1024) x (iters / 5)
    // https://deepinfra.com/stabilityai/sdxl-turbo
    const width = size.split('x')[0]
    const height = size.split('x')[1]
    const iters = 5 // fixed at 5 for now
    return 0.0002 * (width / 1024) * (height / 1024) * iters
  }

  getData() {
    return this.data
  }
}

export default SdxlTurbo 