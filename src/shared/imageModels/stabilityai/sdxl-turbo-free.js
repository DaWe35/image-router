import { PRICING_TYPES } from '../../PricingScheme.js'

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