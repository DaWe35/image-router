import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple, processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

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
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.0680,
              average: 0.144,
              max: 0.144
            }
          },
          applyImage: applyImageRunwareVideo
        }, {
          id: 'wavespeed',
          model_name: 'bytedance/seedance-v1-lite-t2v-720p',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.16
          },
          applyImage: this.applyImageWaveSpeed
        }
      ],
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
    params.model = 'bytedance/seedance-v1-lite-i2v-720p'
    delete params.files.image
    return params
  }
}

export default Seedance1Lite