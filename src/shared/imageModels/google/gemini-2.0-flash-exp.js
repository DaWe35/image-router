import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'

class Gemini20FlashExp {
  constructor() {
    this.data = {
      id: 'google/gemini-2.0-flash-exp',
      providers: [{
        id: 'gemini',
        model_name: 'gemini-2.0-flash-exp-image-generation',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: this.postCalcPrice,
          range: {
            min: 0.04,
            average: 0.04,
            max: 0.8
          },
        },
        applyImage: this.applyImage,
      }],
      arena_score: 962,
      release_date: '2025-03-12',
      examples: [
        {
          image: '/model-examples/gemini-2.0-flash-exp_free-2025-05-13T11-23-59-032Z.webp'
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

  postCalcPrice(imageResult) {
    // Calculate price based on number of images generated
    const pricePerImage = 0.04
    const numberOfImages = imageResult.data ? imageResult.data.length : 1
    return pricePerImage * numberOfImages
  }
}

export default Gemini20FlashExp 