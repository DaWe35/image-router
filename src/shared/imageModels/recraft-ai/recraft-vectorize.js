import { PRICING_TYPES } from '../../PricingScheme.js'
import { encodeFileToDataURI } from '../../../services/imageHelpers.js'

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
      examples: []
    }
  }

  getData() {
    return this.data
  }

  // Convert uploaded image to a base64 data URI and attach as image_url
  async applyImage(params) {
    const images = Array.isArray(params.files.image) ? params.files.image : [params.files.image]
    if (!images.length) {
      throw new Error('No image provided')
    }

    params.image_url = await encodeFileToDataURI(images[0])
    delete params.files.image
    return params
  }
}

export default RecraftVectorize