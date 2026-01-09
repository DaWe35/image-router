import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple, calcVideoPrice } from '../../../services/helpers.js'
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
              max: 0.3456
            }
          },
          applyImage: applyImageRunwareVideo
        }, /* {
          id: 'wavespeed',
          model_name: 'bytedance/seedance-v1-lite-t2v-720p',
          pricing: {
            type: PRICING_TYPES.CALCULATED,
            calcFunction: (params) => calcVideoPrice(params, 0.032) // $0.032 per second (was $0.16 per 5s)
          },
          applyImage: this.applyImageWaveSpeed
        } */
      ],
      sizes: [
        // 480p
        '864x480',
        '736x544',
        '640x640',
        '544x736',
        '480x864',
        '960x416',
        // 720p
        '1248x704',
        '1120x832',
        '960x960',
        '832x1120',
        '704x1248',
        '1504x640',
        // 1080p
        '1920x1088',
        '1664x1248',
        '1440x1440',
        '1248x1664',
        '1088x1920',
        '2176x928',
      ],
      release_date: '2025-06-16',
      seconds: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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