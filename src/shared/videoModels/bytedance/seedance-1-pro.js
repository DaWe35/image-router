import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

class Seedance1Pro {
  constructor() {
    this.data = {
      id: 'bytedance/seedance-1-pro',
      providers: [
        {
          id: 'runware',
          model_name: 'bytedance:2@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.1132,
              average: 0.57,
              max: 0.7,
            },
          },
          applyImage: applyImageRunwareVideo,
        }, {
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
      seconds: [5],
      default_seconds: 5
    }
  }

  getData() {
    return this.data
  }

  async applyImageWaveSpeed(params) {
    params.image = await processSingleFile(params.files.image, 'datauri')
    params.model = 'bytedance/seedance-v1-pro-i2v-720p'
    delete params.files.image
    return params
  }
}

export default Seedance1Pro