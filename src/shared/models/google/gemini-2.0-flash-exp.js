import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'

class Gemini20FlashExp {
  constructor() {
    this.data = {
      id: 'google/gemini-2.0-flash-exp',
      providers: [{
        id: 'google',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.01,
        },
        applyImage: this.applyImage,
        getModelToUse: this.getModelToUse
      }],
      arena_score: 966,
      examples: [
        {
          image: '/model-examples/gemini-2.0-flash-exp_free-2025-04-07T22-34-11-327Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  getModelToUse(quality) {
    return 'gemini-2.0-flash-exp-image-generation'
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