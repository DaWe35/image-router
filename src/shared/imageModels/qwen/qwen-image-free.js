import { PRICING_TYPES } from '../../PricingScheme.js'

export default class QwenImageFree {
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
      arena_score: 1073,
      release_date: '2025-08-01'
    }
  }

  getData() {
    return this.data
  }
}
