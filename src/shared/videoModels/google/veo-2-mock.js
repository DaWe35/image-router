import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/helpers.js'

class Veo2 {
  constructor() {
    this.data = {
      id: 'google/veo-2-mock',
      providers: [{
        id: 'geminiMock',
        model_name: 'veo-2.0-generate-001',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0
        },
        applyImage: this.applyImage
      }],
      release_date: '2024-12-16',
      sizes: [
        '1280x720',
        '720x1280',
        '1920x1080',
        '1080x1920',
      ]
    }
  }

  getData() {
    return this.data
  }

  async applyImage(params) {
    params.image = await processSingleFile(params.files.image)
    delete params.files.image
    return params
  }
}

export default Veo2 