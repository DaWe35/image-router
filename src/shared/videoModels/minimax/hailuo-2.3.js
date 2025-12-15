import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class Hailuo23 {
  constructor() {
    this.data = {
      id: 'minimax/hailuo-2.3',
      providers: [
        {
          id: 'runware',
          model_name: 'minimax:4@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.28,
              average: 0.28,
              max: 0.49,
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
      seconds: [6],
      default_seconds: 6
    }
  }

  getData() {
    return this.data
  }
}
