import { PRICING_TYPES } from '../../PricingScheme.js'

class RecraftV3Svg {
  constructor() {
    this.data = {
      id: 'recraft-ai/recraft-v3-svg',
      providers: [{
        id: 'replicate',
        model_name: 'recraft-ai/recraft-v3-svg',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.08
        }
      }],
      release_date: '2024-10-30'
    }
  }

  getData() {
    return this.data
  }
}

export default RecraftV3Svg 