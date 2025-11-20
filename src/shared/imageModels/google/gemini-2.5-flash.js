import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'

export default class Gemini25Flash {
  constructor() {
    this.data = {
      id: 'google/gemini-2.5-flash',
      sizes: [
        '1024x1024',
        '832x1248',
        '1248x832',
        '864x1184',
        '1184x864',
        '896x1152',
        '1152x896',
        '768x1344',
        '1344x768',
        '1536x672',
      ],
      providers: [
        {
          id: 'gemini',
          model_name: 'gemini-2.5-flash-image',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: this.postCalcPrice,
            value: 0.035,
          },
          applyImage: this.applyImageGemini,
        }, {
          id: 'vertex',
          model_name: 'gemini-2.5-flash-image',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.035,
          },
          applyImage: this.applyImageVertex
        }
      ],
      arena_score: 1167,
      release_date: '2025-10-02'
    }
  }

  getData() {
    return this.data
  }

  async applyImageVertex(params) {
    // Process single or multiple image files
    const processedImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    
    // Store the images for use in the API call
    params.imagesData = Array.isArray(processedImages) ? processedImages : [processedImages]
    
    return params
  }

  async applyImageGemini(params) {
    // Process single or multiple image files
    const processedImages = await processSingleOrMultipleFiles(params.files.image)
    
    // Store the images for use in the API call
    params.imagesData = Array.isArray(processedImages) ? processedImages : [processedImages]
    
    return params
  }

  postCalcPrice(imageResult, params) {
    // Calculate price based on number of images generated
    const pricePerImage = 0.035
    const numberOfImages = imageResult.data ? imageResult.data.length : 1
    return pricePerImage * numberOfImages
  }
}
