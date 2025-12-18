import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'lightricks/ltx-2-fast',
      providers: [
        {
          id: 'runware',
          model_name: 'lightricks:2@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.24,
              average: 0.24,
              max: 0.96,
            },
          },
          applyImage: applyImageRunwareVideo,
        }
      ],
      release_date: '2025-10-23',
      sizes: [
        '1920x1080',
        '2560x1440',
        '3840x2160'
      ],
      seconds: [6, 8, 10, 20],
      default_seconds: 6
    }
  }

  getData() {
    return this.data
  }
}
