import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'bytedance/seedance-1.5-pro',
      providers: [
        {
          id: 'runware',
          model_name: 'bytedance:seedance@1.5-pro',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.12,
              average: 0.26,
              max: 0.6,
            },
          },
          applyImage: applyImageRunwareVideo,
        },
      ],
      sizes: [
        // 480p
        '864x496',
        '752x560',
        '640x640',
        '560x752',
        '496x864',
        '992x432',
        // 720p
        '1280x720',
        '1112x834',
        '960x960',
        '834x1112',
        '720x1280',
        '1470x630',
      ],
      release_date: '2025-12-23',
      seconds: [4, 5, 6, 7, 8, 9, 10, 11, 12],
      default_seconds: 5
    }
  }

  getData() {
    return this.data
  }
}
