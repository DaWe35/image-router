import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/imageHelpers.js'

class Kling21Pro {
  constructor() {
    this.data = {
      id: 'kwaivgi/kling-v2.1-pro',
      providers: [{
        id: 'replicate',
        model_name: 'kwaivgi/kling-v2.1', // same replicate model, but pro mode
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.45, // price per 5-second video (0.09 $/sec)
        },
        applyImage: this.applyImage,
      }],
      arena_score: 1120,
      release_date: '2025-06-24',
      examples: [
        {
          video: '/model-examples/kling-v2.1-pro.webm'
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

export default Kling21Pro 