import { PRICING_TYPES } from '../../PricingScheme.js'
import { encodeFileToDataURI } from '../../../services/imageHelpers.js'

class RecraftV3 {
  constructor() {
    this.data = {
      id: 'recraft-ai/recraft-v3',
      providers: [{
        id: 'fal',
        model_name: 'fal-ai/recraft/v3/text-to-image',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.04,
        },
        applyImage: this.applyImage
      }],
      arena_score: 1110,
      release_date: '2024-10-30',
      examples: [
        {
          image: '/model-examples/recraft-v3-2025-04-03T15-09-40-800Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  // Convert uploaded image to a base64 data-URI accepted by the Recraft image-to-image endpoint
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

export default RecraftV3 