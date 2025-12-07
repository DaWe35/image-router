import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/imageHelpers.js'
import { applyImageSingleBase64 } from '../../applyImage.js'

class Veo2 {
  constructor() {
    this.data = {
      id: 'google/veo-2',
      providers: [{
        id: 'gemini',
        model_name: 'veo-2.0-generate-001',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 1.75,
        },
        applyImage: applyImageSingleBase64,
      }],
      arena_score: 1115,
      release_date: '2024-12-16'
    }
  }

  getData() {
    return this.data
  }
}

export default Veo2 