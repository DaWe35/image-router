import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

class Kling21TurboPro {
  constructor() {
    this.data = {
      id: 'kwaivgi/kling-2.5-turbo-pro',
      providers: [
        {
          id: 'runware',
          model_name: 'klingai:6@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.35,
          },
          applyImage: applyImageRunwareVideo,
        }
      ],
      arena_score: 1241,
      release_date: '2025-09-23',
      examples: [
        {
          video: '/model-examples/kling-2.5-turbo-pro-2025-10-14T14-38-16-722Z.webm'
        }
      ]
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

export default Kling21TurboPro 