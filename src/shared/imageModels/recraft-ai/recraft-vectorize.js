import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/imageHelpers.js'

class RecraftVectorize {
  constructor() {
    this.data = {
      id: 'recraft-ai/recraft-vectorize',
      providers: [{
        id: 'fal',
        model_name: 'fal-ai/recraft/vectorize',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.01
        },
        applyImage: this.applyImage
      }],
      release_date: '2025-07-01',
      examples: [
        {
          image: '/model-examples/recraft-vectorize-compressed-2025-06-24T13-39-45-891Z.svg'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  // Convert uploaded image to a base64 data URI and attach as image_url
  async applyImage(params) {
    params.image_url = await processSingleFile(params.files.image, 'datauri')
    delete params.files.image
    return params
  }
}

export default RecraftVectorize