import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/imageHelpers.js'

class Kling21Standard {
  constructor() {
    this.data = {
      id: 'kwaivgi/kling-v2.1-standard',
      providers: [{
        id: 'replicate',
        model_name: 'kwaivgi/kling-v2.1',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.25, // price per 5-second video (0.05 $/sec)
        },
        applyImage: this.applyImage,
      }],
      // Benchmark / meta data – values are estimates / placeholders
      arena_score: 1080,
      release_date: '2025-06-24',
      examples: [
        {
          video: '/model-examples/kling-v2.1-standard.webm'
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

export default Kling21Standard 