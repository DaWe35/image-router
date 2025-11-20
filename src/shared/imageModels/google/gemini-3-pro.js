import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'

export default class Gemini3Pro {
  constructor() {
    this.data = {
      id: 'google/gemini-3-pro',
      sizes: [
        // 1K resolution
        '1024x1024',
        '848x1264',
        '1264x848',
        '896x1200',
        '1200x896',
        '928x1152',
        '1152x928',
        '768x1376',
        '1376x768',
        '1584x672',
        // 2K resolution
        '2048x2048',
        '1696x2528',
        '2528x1696',
        '1792x2400',
        '2400x1792',
        '1856x2304',
        '2304x1856',
        '1536x2752',
        '2752x1536',
        '3168x1344',
        // 4K resolution
        '4096x4096',
        '3392x5056',
        '5056x3392',
        '3584x4800',
        '4800x3584',
        '3712x4608',
        '4608x3712',
        '3072x5504',
        '5504x3072',
        '6336x2688',
      ],
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
