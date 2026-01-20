import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple, calcVideoPrice } from '../../../services/helpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'kling/kling-1.6-standard',
      providers: [
        {
          id: 'runware',
          model_name: 'klingai:3@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.1848,
              average: 0.1848,
              max: 0.3696
            },
          },
          applyImage: applyImageRunwareVideo
        }, {
          id: 'replicate',
          model_name: 'kwaivgi/kling-v1.6-standard',
          pricing: {
            type: PRICING_TYPES.CALCULATED,
            calcFunction: (params) => calcVideoPrice(params, 0.05),
            range: {
              min: 0.25,
              average: 0.25,
              max: 0.5
            }

          },
          applyImage: this.applyImage
        }
      ],
      release_date: '2024-12-19',
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
