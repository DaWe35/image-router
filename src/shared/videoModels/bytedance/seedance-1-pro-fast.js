import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class Seedance1ProFast {
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
              min: 0.0315,
              average: 0.1602,
              max: 0.7
            }
          },
          applyImage: applyImageRunwareVideo
        }
    ],
      arena_score: 1347,
      release_date: '2025-10-24',
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
     ]
    }
  }

  getData() {
    return this.data
  }
}
