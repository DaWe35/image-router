import { PRICING_TYPES } from '../../PricingScheme.js'

class SdxlTurboFree {
  constructor() {
    this.data = {
      id: 'stabilityai/sdxl-turbo:free',
      aliasOf: 'stabilityai/sdxl-turbo',
      providers: [{
        name: 'deepinfra',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0,
        }
      }],
      arenaScore: 1030,
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