import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'

export default class Gemini25Flash {
  constructor() {
    this.data = {
      id: 'google/gemini-2.5-flash',
      providers: [{
        id: 'gemini',
        model_name: 'gemini-2.5-flash-image-preview',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: this.postCalcPrice,
          value: 0.0272,
        },
        applyImage: this.applyImageGemini,
      }],
      arena_score: 1167,
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

  async applyImageGemini(params) {
    // Process single or multiple image files
    const processedImages = await processSingleOrMultipleFiles(params.files.image)
    
    // Store the images for use in the API call
    params.imagesData = Array.isArray(processedImages) ? processedImages : [processedImages]
    
    return params
  }

  postCalcPrice(imageResult) {
    // Calculate price based on number of images generated
    const pricePerImage = 0.0272
    const numberOfImages = imageResult.data ? imageResult.data.length : 1
    return pricePerImage * numberOfImages
  }
}
