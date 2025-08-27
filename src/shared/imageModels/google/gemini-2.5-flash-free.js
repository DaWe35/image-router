import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'

export default class Gemini25FlashFree {
  constructor() {
    this.data = {
      id: 'google/gemini-2.5-flash:free',
      providers: [{
        id: 'openrouter',
        model_name: 'google/gemini-2.5-flash-image-preview',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0,
        },
        applyImage: this.applyImage,
      }],
      arena_score: 1165,
      release_date: '2025-08-26',
      examples: [
        {
          image: '/model-examples/gemini-2.5-flash_free-2025-08-27T20-15-19-867Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  async applyImage(params) {
    // Process single or multiple image files
    const processedImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    
    // Store the images for use in the API call
    params.imagesData = Array.isArray(processedImages) ? processedImages : [processedImages]
    
    return params
  }
}