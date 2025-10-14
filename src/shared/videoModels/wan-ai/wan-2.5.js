import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

class Wan25 {
  constructor() {
    this.data = {
      id: 'kwaivgi/wan-2.5',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:201@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.473,
          },
          applyImage: applyImageRunwareVideo,
        }
      ],
      arena_score: 1190,
      release_date: '2025-09-24',
      examples: [
        {
          video: '/model-examples/wan-2.5-2025-10-14T15-04-21-122Z.webm'
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

export default Wan25 