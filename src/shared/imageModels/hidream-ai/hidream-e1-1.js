import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyFalImage } from '../../applyImage.js'

class HidreamE11 {
  constructor() {
    this.data = {
      id: 'HiDream-ai/HiDream-E1-1',
      providers: [{
        id: 'fal',
        model_name: 'fal-ai/hidream-e1-1',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.06
        },
        applyImage: applyFalImage
      }],
      release_date: '2025-06-16',
      examples: [
        {
          image: '/model-examples/HiDream-E1-1-2025-10-13.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default HidreamE11