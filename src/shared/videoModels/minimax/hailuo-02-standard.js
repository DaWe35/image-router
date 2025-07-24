import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

class Hailuo02Standard {
  constructor() {
    this.data = {
      id: 'minimax/hailuo-02-standard',
      providers: [
        {
          id: 'runware',
          model_name: 'minimax:3@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.231,
              average: 0.231,
              max: 0.4,
            },
          },
          applyImage: applyImageRunwareVideo,
        }, {
          id: 'wavespeed',
          model_name: 'minimax/hailuo-02/standard',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.28, // price per video in USD
          },
          applyImage: this.applyImage,
        }
      ],
      release_date: '2025-06-18',
      examples: [
        {
          video: '/model-examples/hailuo-02-standard-2025-06-24T15-24-10-877Z.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

    async applyImage(params) {
      params.image = await processSingleFile(params.files.image, 'datauri')
      delete params.files.image
      return params
    }
}

export default Hailuo02Standard 