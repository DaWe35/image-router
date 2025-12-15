import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class Ltx2Pro {
  constructor() {
    this.data = {
      id: 'lightricks/ltx-2-pro',
      providers: [
        {
          id: 'runware',
          model_name: 'lightricks:2@0',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.36,
              average: 0.36,
              max: 1.44,
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
      seconds: [6],
      default_seconds: 6
    }
  }

  getData() {
    return this.data
  }
}
