import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'kling/kling-2.6-pro',
      providers: [
        {
          id: 'runware',
          model_name: 'klingai:kling-video@2.6-pro',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.7,
              average: 0.7,
              max: 1.4
            },
          },
          applyImage: applyImageRunwareVideo
        }
      ],
      sizes: [
        '1024x1024',
        '1536x640',
        '1344x768',
        '1152x896',
        '1280x832',
        '832x1280',
        '896x1152',
        '768x1344',
        '640x1536',
      ],
      release_date: '2025-12-15',
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