import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/helpers.js'

class HiDreamI1FullFree {
  constructor() {
    this.data = {
      id: 'HiDream-ai/HiDream-I1-Full:free',
      providers: [{
        id: 'chutes',
        model_name: 'hidream',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0
        },
        // applyImage: this.applyImage // Chutes remove the edit model?
      }],
      release_date: '2025-04-28'
    }
  }

  // Convert uploaded image to base64 string expected by Chutes edit endpoint
  async applyImage(params) {
    params.image_b64 = await processSingleFile(params.files.image, 'datauri')
    delete params.files.image
    return params
  }

  getData() {
    return this.data
  }
}

export default HiDreamI1FullFree 