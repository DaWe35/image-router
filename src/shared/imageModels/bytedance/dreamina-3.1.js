import { PRICING_TYPES } from '../../PricingScheme.js'

class DreaminaV31 {
  constructor() {
    this.data = {
      id: 'bytedance/dreamina-3.1',
      providers: [{
        id: 'fal',
        model_name: 'fal-ai/bytedance/dreamina/v3.1/text-to-image',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.03
        }
      }],
      release_date: '2025-08-01',
      examples: [
        {
          image: '/model-examples/dreamina-3.1-2025-08-07T12-08-35-605Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default DreaminaV31