import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/helpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'kling/kling-2.5-turbo-pro',
      providers: [
        {
          id: 'runware',
          model_name: 'klingai:6@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.35,
              average: 0.35,
              max: 0.7
            },
          },
          applyImage: applyImageRunwareVideo
        }
      ],
      sizes: [
        '1920x1080',
        '1080x1080',
        '1080x1920',
      ],
      release_date: '2025-09-23',
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