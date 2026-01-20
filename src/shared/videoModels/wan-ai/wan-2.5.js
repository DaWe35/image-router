import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'wan/wan-2.5',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:201@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.473,
              average: 0.473,
              max: 0.738
            }
          },
          applyImage: applyImageRunwareVideo
        }
      ],
      release_date: '2025-09-24',
      seconds: [5, 8],
      default_seconds: 5
    }
  }

  getData() {
    return this.data
  }
}
 