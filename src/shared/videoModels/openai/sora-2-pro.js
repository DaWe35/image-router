import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class Sora2Pro {
  constructor() {
    this.data = {
      id: 'openai/sora-2-pro',
      providers: [{
        id: 'runware',
        model_name: 'openai:3@2',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 1.2,
            average: 1.2,
            max: 6
          },
        },
        applyImage: applyImageRunwareVideo
      }],
      release_date: '2025-09-30',
      sizes: [
        '1280x720',
        '720x1280',
        '1024x1792',
        '1792x1024'
      ],
      seconds: [4, 8, 12],
      default_seconds: 4
    }
  }

  getData() {
    return this.data
  }
}
