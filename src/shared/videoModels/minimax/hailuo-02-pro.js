import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/imageHelpers.js'

class Hailuo02Pro {
  constructor() {
    this.data = {
      id: 'minimax/hailuo-02-pro',
      providers: [{
        id: 'wavespeed',
        model_name: 'minimax/hailuo-02/pro',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.44, // price per video in USD
        },
        applyImage: this.applyImage,
      }],
      arena_score: 1322,
      release_date: '2025-06-18',
      examples: [
        {
          video: '/model-examples/hailuo-02-pro-2025-06-24T18-11-17-158Z.webm'
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

export default Hailuo02Pro 