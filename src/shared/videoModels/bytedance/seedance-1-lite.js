import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcRunware } from '../../../services/imageHelpers.js'

class Seedance1Lite {
  constructor() {
    this.data = {
      id: 'bytedance/seedance-1-lite',
      providers: [
        {
          id: 'runware',
          model_name: 'bytedance:1@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcRunware,
            value: 0.144,
          },
        }, {
        id: 'wavespeed',
        model_name: 'bytedance/seedance-v1-lite-t2v-720p',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.16,
        },
        applyImage: this.applyImageWaveSpeed,
      }],
      release_date: '2025-06-16',
      examples: [
        {
          video: '/model-examples/seedance-1-2025-06-16T19-01-20-528Z.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  async applyImageWaveSpeed(params) {
    params.image = await processSingleFile(params.files.image)
    params.model = 'bytedance/seedance-v1-lite-i2v-720p'
    delete params.files.image
    return params
  }
}

export default Seedance1Lite