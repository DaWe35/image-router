import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles, sizeToImageSize } from '../../../services/imageHelpers.js'

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
            range: {
              min: 0.134,
              average: 0.134,
              max: 0.24
            },
          },
          applyImage: this.applyImageGemini,
        }
      ],
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

  postCalcPrice(imageResult, params) {
    // Input pricing
    const inputImagePrice = 0.0011
    let inputCost = 0
    if (params && params.files && params.files.image) {
      const inputImageCount = Array.isArray(params.files.image) ? params.files.image.length : 1
      inputCost = inputImageCount * inputImagePrice
    }

    // Input character pricing: $2 per 1 million characters
    const inputCharacterPricePerMillion = 2.0
    if (params && params.prompt) {
      const characterCount = params.prompt.length
      const inputCharacterCost = (characterCount / 1_000_000) * inputCharacterPricePerMillion
      inputCost += inputCharacterCost
    }

    // Output pricing
    const outputImagePrice1K2K = 0.134
    const outputImagePrice4K = 0.24

    let outputCost = 0
    const numberOfImages = imageResult.data ? imageResult.data.length : 1

    // Determine size
    const size = params.size
    const imageSize = sizeToImageSize[size] || '1K' // Default to 1K if unknown

    const pricePerOutputImage = imageSize === '4K' ? outputImagePrice4K : outputImagePrice1K2K

    outputCost = numberOfImages * pricePerOutputImage

    return inputCost + outputCost
  }
}
