import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
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
            value: 0.3674
          },
          applyImage: applyImageRunwareVideo
        }
      ],
      arena_score: 1115,
      release_date: '2025-07-15',
      seconds: [5],
      default_seconds: 5
    }
  }

  getData() {
    return this.data
  }

  async applyImage(params) {
    params.start_image = await processSingleFile(params.files.image, 'datauri')
    delete params.files.image
    return params
  }
}

export default Wan22 