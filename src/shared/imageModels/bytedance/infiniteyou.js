import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/helpers.js'

class InfiniteYou {
  constructor() {
    this.data = {
      id: 'ByteDance/InfiniteYou',
      providers: [{
        id: 'chutes',
        model_name: 'infiniteyou',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.01
        },
        applyImage: this.applyImage
      }],
      release_date: '2025-03-21'
      
    }
  }

  // Convert uploaded image to base64 string expected by InfiniteYou endpoint
  async applyImage(params) {
    if (!images.length) {
      throw new Error('No image provided. Please provide a reference image with a person in it.')
    }
    params.id_image_b64 = await processSingleFile(params.files.image, 'datauri')
    delete params.files.image
    return params
  }

  getData() {
    return this.data
  }
}

export default InfiniteYou