import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class SdxlTurboFree {
  constructor() {
    this.data = {
      id: 'stabilityai/sdxl-turbo:free',
      providers: [{
        id: 'deepinfra',
        model_name: 'stabilityai/sdxl-turbo',
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
      arena_score: 1031,
      release_date: '2024-10-22',
      examples: [
        {
          image: '/model-examples/sdxl-turbo.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default SdxlTurboFree 