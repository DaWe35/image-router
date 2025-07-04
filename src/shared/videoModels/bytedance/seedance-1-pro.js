import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/imageHelpers.js'

class Seedance1Pro {
  constructor() {
    this.data = {
      id: 'bytedance/seedance-1-pro',
      providers: [
        {
        id: 'wavespeed',
        model_name: 'bytedance/seedance-v1-pro-t2v-720p',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.3,
        },
        applyImage: this.applyImageWaveSpeed,
      }
    ],
      arena_score: 1347,
      release_date: '2025-06-16',
      examples: [
        {
          video: '/model-examples/seedance-1-pro-2025-06-20T21-03-30-821Z.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  async applyImageWaveSpeed(params) {
    params.image = await processSingleFile(params.files.image)
    params.model = 'bytedance/seedance-v1-pro-i2v-720p'
    delete params.files.image
    return params
  }
}

export default Seedance1Pro