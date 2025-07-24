import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyFalImage } from '../../applyImage.js'

class SeedreamEditV3 {
  constructor() {
    this.data = {
      id: 'bytedance/seededit-3',
      providers: [{
        id: 'fal',
        model_name: 'fal-ai/bytedance/seededit/v3/edit-image',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.03,
        },
        applyImage: applyFalImage
      }],
      release_date: '2025-07-06'
    }
  }

  getData() {
    return this.data
  }
}

export default SeedreamEditV3 