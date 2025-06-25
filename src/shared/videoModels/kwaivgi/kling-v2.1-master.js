import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/imageHelpers.js'

class Kling21Master {
  constructor() {
    this.data = {
      id: 'kwaivgi/kling-v2.1-master',
      providers: [{
        id: 'replicate',
        model_name: 'kwaivgi/kling-v2.1-master',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 1.40, // price per 5-second video (0.28 $/sec)
        },
        applyImage: this.applyImage,
      }],
      arena_score: 1150,
      release_date: '2025-06-24',
      examples: [
        {
          video: '/model-examples/kling-v2.1-master.webm'
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

export default Kling21Master 