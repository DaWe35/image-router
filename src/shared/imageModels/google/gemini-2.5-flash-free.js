import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'

export default class Gemini25FlashFree {
  constructor() {
    this.data = {
      id: 'google/gemini-2.5-flash:free',
      providers: [{
        id: 'openrouter',
        model_name: 'google/gemini-2.5-flash-image-preview:free',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0
        },
        applyImage: this.applyImageOpenRouter
      }],
      arena_score: 1167,
      release_date: '2025-08-26'
      
    }
  }

  getData() {
    return this.data
  }

  async applyImageOpenRouter(params) {
    // Process single or multiple image files
    const processedImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    
    // Store the images for use in the API call
    params.imagesData = Array.isArray(processedImages) ? processedImages : [processedImages]
    
    return params
  }
}