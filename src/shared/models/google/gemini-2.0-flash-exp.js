import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'

class Gemini20FlashExp {
  constructor() {
    this.data = {
      id: 'google/gemini-2.0-flash-exp',
      aliasOf: 'google/gemini-2.0-flash-exp-image-generation',
      providers: [{
        id: 'google',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.01,
        },
        applyImage: this.applyImage,
      }],
      arena_score: 966,
      examples: [
        {
          image: '/model-examples/gemini-2.0-flash-exp_free-2025-05-06T13-16-25-288Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  async applyImage(params) {
    // Process single or multiple image files
    const processedImages = await processSingleOrMultipleFiles(params.files.image)
    
    // Store the images for use in the API call
    params.imagesData = Array.isArray(processedImages) ? processedImages : [processedImages]
    
    return params
  }
}

export default Gemini20FlashExp 