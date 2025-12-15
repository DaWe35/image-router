import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple, calcVideoPrice } from '../../../services/imageHelpers.js'
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
            range: {
              min: 0.924,
              average: 0.924,
              max: 1.848
            },
          },
          applyImage: applyImageRunwareVideo,
        },
        {
          id: 'replicate',
          model_name: 'kwaivgi/kling-v2.1-master',
          pricing: {
            type: PRICING_TYPES.CALCULATED,
            calcFunction: (params) => calcVideoPrice(params, 0.28),
            range: {
              min: 1.4,
              average: 1.4,
              max: 2.8
            }
          },
          applyImage: this.applyImage,
        }
      ],
      sizes: [
        '1920x1080',
        '1080x1080',
        '1080x1920',
      ],
      arena_score: 1150,
      release_date: '2025-06-24',
      seconds: [5, 10],
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