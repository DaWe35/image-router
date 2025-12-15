import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class Kling25TurboStandard {
  constructor() {
    this.data = {
      id: 'kwaivgi/kling-2.5-turbo-standard',
      providers: [
        {
          id: 'runware',
          model_name: 'klingai:6@0',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.21,
              average: 0.21,
              max: 0.42
            },
          },
          applyImage: applyImageRunwareVideo
        }
      ],
      release_date: '2025-09-23',
      seconds: [5, 10],
      default_seconds: 5
    }
  }

  getData() {
    return this.data
  }
}
