import { PRICING_TYPES } from '../../PricingScheme.js'

export default class {
  constructor() {
    this.data = {
      id: 'qwen/qwen-image:free',
      providers: [{
        id: 'chutes',
        model_name: 'qwen-image',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0
        },
      }],
      release_date: '2025-08-01'
    }
  }

  getData() {
    return this.data
  }
}
