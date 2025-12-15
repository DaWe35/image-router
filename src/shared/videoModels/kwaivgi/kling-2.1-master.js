import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

class Kling21Master {
  constructor() {
    this.data = {
      id: 'kwaivgi/kling-2.1-master',
      providers: [
        {
          id: 'runware',
          model_name: 'klingai:4@3',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.924,
          },
          applyImage: applyImageRunwareVideo,
        },
        {
          id: 'replicate',
          model_name: 'kwaivgi/kling-v2.1-master',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 1.40, // price per 5-second video (0.28 $/sec)
          },
          applyImage: this.applyImage,
        }
      ],
      arena_score: 1150,
      release_date: '2025-06-24',
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

export default Kling21Master 