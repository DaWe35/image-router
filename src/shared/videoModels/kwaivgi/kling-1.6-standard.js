import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

class Kling16Standard {
  constructor() {
    this.data = {
      id: 'kwaivgi/kling-1.6-standard',
      providers: [
        {
          id: 'runware',
          model_name: 'klingai:3@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.1848,
          },
          applyImage: applyImageRunwareVideo,
        }, {
          id: 'replicate',
          model_name: 'kwaivgi/kling-v1.6-standard',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.25, // price per video on Replicate
          },
          applyImage: this.applyImage,
        }
      ],
      arena_score: 1025,
      release_date: '2024-12-19',
      examples: [
        {
          video: '/model-examples/kling-1.6-standard.webm'
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

export default Kling16Standard 