import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles, processSingleFile } from '../../../services/imageHelpers.js'

class GptImage1 {
  constructor() {
    this.data = {
      id: 'openai/gpt-image-1',
      providers: [{
        id: 'openai',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: this.postCalcPrice,
          range: {
            min: 0.011,
            average: 0.167,
            max: 0.5
          },
        },
        applyQuality: this.applyQuality,
        applyImage: this.applyImage,
        applyMask: this.applyMask
      }],
      arena_score: 1156,
      release_date: '2025-04-23',
      examples: [
        {
          image: '/model-examples/gpt-image-1.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  getModelToUse(quality) {
    return 'gpt-image-1'
  }

  postCalcPrice(imageResult) {
      const inputTextPrice = 0.000005
      const inputImagePrice = 0.00001
      const outputImagePrice = 0.00004

      const inputTextTokens = imageResult.usage.input_tokens_details.text_tokens
      const inputImageTokens = imageResult.usage.input_tokens_details.image_tokens
      const outputImageTokens = imageResult.usage.output_tokens

      const totalPrice = inputTextPrice * inputTextTokens + inputImagePrice * inputImageTokens + outputImagePrice * outputImageTokens
      return totalPrice
  }

  applyQuality(params) {
    const validQualities = ['auto', 'low', 'medium', 'high'] // future proofing
    if (validQualities.includes(params.quality)) {
      params.quality = params.quality
    } else {
      throw new Error("'quality' must be 'auto', 'low', 'medium', or 'high'")
    }
    return params
  }

  async applyImage(params) {
    params.image = await processSingleOrMultipleFiles(params.files.image)
    delete params.files.image
    return params
  }

  async applyMask(params) {
    params.mask = await processSingleFile(params.files.mask)
    delete params.files.mask
    return params
  }
}

export default GptImage1 