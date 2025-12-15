import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcVideoPerSecond, calcVideoPrice } from '../../../services/imageHelpers.js'
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
              min: 0.0937,
              average: 0.484,
              max: 1.68,
            },
          },
          applyImage: applyImageRunwareVideo,
        }, /* {
          id: 'wavespeed',
          model_name: 'bytedance/seedance-v1-pro-t2v-720p',
          pricing: {
            type: PRICING_TYPES.CALCULATED,
            calcFunction: (params) => calcVideoPrice(params, 0.06) // $0.06 per second (was $0.3 per 5s)
          },
          applyImage: this.applyImageWaveSpeed,
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
      arena_score: 1347,
      release_date: '2025-06-16',
      seconds: [1.2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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