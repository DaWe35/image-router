import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

class Wan22 {
  constructor() {
    this.data = {
      id: 'kwaivgi/wan-2.2',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:200@6',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.3674,
              average: 0.3674,
              max: 0.6
            }
          },
          applyImage: applyImageRunwareVideo
        }
      ],
      release_date: '2025-07-15',
      seconds: [5, 8],
      default_seconds: 5
    }
  }

  getData() {
    return this.data
  }
}

export default Wan22 