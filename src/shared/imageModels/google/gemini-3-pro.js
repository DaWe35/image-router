import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'

export default class Gemini3Pro {
  constructor() {
    this.data = {
      id: 'google/gemini-3-pro',
      providers: [
        {
          id: 'gemini',
          model_name: 'gemini-3-pro-image-preview',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: this.postCalcPrice,
            value: 0.134,
          },
          applyImage: this.applyImageGemini,
        }
      ],
      arena_score: 1200,
      release_date: '2025-11-20'
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
    const pricePerImage = 0.134
    const numberOfImages = imageResult.data ? imageResult.data.length : 1
    return pricePerImage * numberOfImages
  }
}
