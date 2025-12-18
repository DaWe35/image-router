import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'minimax/hailuo-2.3-fast',
      providers: [
        {
          id: 'runware',
          model_name: 'minimax:4@2',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.19,
              average: 0.19,
              max: 0.33,
            },
          },
          applyImage: applyImageRunwareVideo,
        }
      ],
      release_date: '2025-10-28',
      sizes: [
        '1366x768',
        '1920x1080'
      ],
      seconds: [6, 10],
      default_seconds: 6
    }
  }

  getData() {
    return this.data
  }
}
