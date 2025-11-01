import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class Ltx2Fast {
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
      examples: [
        {
          video: '/model-examples/ltx-2-fast-2025-11-01T23-44-35-081Z.webm'
        }
      ],
      sizes: [
        '1920x1080',
        '2560x1440',
        '3840x2160'
      ]
    }
  }

  getData() {
    return this.data
  }
}
