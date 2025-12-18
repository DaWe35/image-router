import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'openai/sora-2',
      providers: [{
        id: 'runware',
        model_name: 'openai:3@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.4,
            average: 0.4,
            max: 1.2
          },
        },
        applyImage: applyImageRunwareVideo
      }],
      release_date: '2025-09-30',
      sizes: [
        '1280x720',
        '720x1280',
      ],
      seconds: [4, 8, 12],
      default_seconds: 4
    }
  }

  getData() {
    return this.data
  }
}
