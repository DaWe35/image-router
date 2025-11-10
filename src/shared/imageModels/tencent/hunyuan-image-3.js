import { PRICING_TYPES } from '../../PricingScheme.js'

export default class HunyuanImage3 {
  constructor() {
    this.data = {
      id: 'tencent/hunyuan-image-3',
      providers: [{
        id: 'replicate',
        model_name: 'tencent/hunyuan-image-3',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.08
        },
      }],
      release_date: '2025-09-28',
      examples: [
        {
          image: '/model-examples/hunyuan-image-3.webp'
        }
      ],
    }
  }

  getData() {
    return this.data
  }
}
