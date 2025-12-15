import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple, calcVideoPrice } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

class Kling21Standard {
  constructor() {
    this.data = {
      id: 'kwaivgi/kling-2.1-standard',
      providers: [
        {
          id: 'runware',
          model_name: 'klingai:5@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.1848,
              average: 0.1848,
              max: 0.3696
            },
          },
          applyImage: applyImageRunwareVideo,
        }, {
          id: 'replicate',
          model_name: 'kwaivgi/kling-v2.1',
          pricing: {
            type: PRICING_TYPES.CALCULATED,
            calcFunction: (params) => calcVideoPrice(params, 0.05),
            range: {
              min: 0.25,
              average: 0.25,
              max: 0.5
            }
          },
          applyImage: this.applyImage,
        }
      ],
      // Benchmark / meta data – values are estimates / placeholders
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

export default Kling21Standard 