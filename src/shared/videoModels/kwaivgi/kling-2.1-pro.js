import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple, calcVideoPrice } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

class Kling21Pro {
  constructor() {
    this.data = {
      id: 'kwaivgi/kling-2.1-pro',
      providers: [
        {
          id: 'runware',
          model_name: 'klingai:5@2',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.3234,
              average: 0.3234,
              max: 0.6468
            },
          },
          applyImage: applyImageRunwareVideo,
        }, {
          id: 'replicate',
          model_name: 'kwaivgi/kling-v2.1', // same replicate model, but pro mode
          pricing: {
            type: PRICING_TYPES.CALCULATED,
            calcFunction: (params) => calcVideoPrice(params, 0.09),
            range: {
              min: 0.45,
              average: 0.45,
              max: 0.9
            }
          },
          applyImage: this.applyImage,
        }
      ],
      arena_score: 1120,
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

export default Kling21Pro 