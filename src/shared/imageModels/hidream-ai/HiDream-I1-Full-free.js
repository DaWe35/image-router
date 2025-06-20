import { PRICING_TYPES } from '../../PricingScheme.js'
import { encodeFileToDataURI } from '../../../services/imageHelpers.js'

class HiDreamI1FullFree {
  constructor() {
    this.data = {
      id: 'HiDream-ai/HiDream-I1-Full:free',
      providers: [{
        id: 'chutes',
        model_name: 'hidream',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0,
        },
        applyImage: this.applyImage
      }],
      release_date: '2025-04-28',
      examples: [
        {
          image: '/model-examples/HiDream-I1-Full-2025-06-15T21-31-49-649Z.webp'
        }
      ]
    }
  }

  // Convert uploaded image to base64 string expected by Chutes edit endpoint
  async applyImage(params) {
    const images = Array.isArray(params.files.image) ? params.files.image : [params.files.image]
    if (!images.length) {
      throw new Error('No image provided')
    }
    params.image_b64 = await encodeFileToDataURI(images[0])
    delete params.files.image
    return params
  }

  getData() {
    return this.data
  }
}

export default HiDreamI1FullFree 