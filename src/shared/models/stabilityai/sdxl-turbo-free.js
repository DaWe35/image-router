import { PRICING_TYPES } from '../../PricingScheme.js'

class SdxlTurboFree {
  constructor() {
    this.data = {
      id: 'stabilityai/sdxl-turbo:free',
      providers: [{
        id: 'deepinfra',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0,
        },
        getModelToUse: this.getModelToUse
      }],
      arena_score: 1030,
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

  getModelToUse(quality) {
    return 'stabilityai/sdxl-turbo'
  }
}

export default SdxlTurboFree 