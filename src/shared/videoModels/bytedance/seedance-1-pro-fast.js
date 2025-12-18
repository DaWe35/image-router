import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'bytedance/seedance-1-pro-fast',
      providers: [
        {
          id: 'runware',
          model_name: 'bytedance:2@2',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.00756,
              average: 0.0701,
              max: 0.36864
            }
          },
          applyImage: applyImageRunwareVideo
        }
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
      release_date: '2025-10-24',
      seconds: [1.2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      default_seconds: 5
    }
  }

  getData() {
    return this.data
  }
}
