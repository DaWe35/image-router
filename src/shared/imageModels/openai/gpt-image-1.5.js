import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles, processSingleFile, postCalcNanoGPTDiscounted10, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyInputImagesReferences } from '../../applyImage.js'

class GptImage1 {
  constructor() {
    this.data = {
      id: 'openai/gpt-image-1.5',
      providers: [
        {
          id: 'runware',
          model_name: 'openai:4@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.009,
              average: 0.133,
              max: 0.2
            },
          },
          applyQuality: this.applyQualityRunware,
          applyImage: applyInputImagesReferences,
        },
        {
          id: 'openai',
          model_name: 'gpt-image-1.5',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: this.postCalcPrice,
            range: {
              min: 0.009,
              average: 0.051,
              max: 0.2
            },
          },
          applyQuality: this.applyQuality,
          applyImage: this.applyImage,
          applyMask: this.applyMask,
        }
      ],
      release_date: '2025-12-16',
      sizes: [
        'auto',
        '1024x1024',
        '1536x1024',
        '1024x1536'
      ]
    }
  }

  getData() {
    return this.data
  }

  postCalcPrice(imageResult, params) {
      const inputTextPrice = 0.000005
      const inputImagePrice = 0.000008
      const outputImagePrice = 0.000032

      const inputTextTokens = imageResult.usage.input_tokens_details.text_tokens
      const inputImageTokens = imageResult.usage.input_tokens_details.image_tokens
      const outputImageTokens = imageResult.usage.output_tokens

      const totalPrice = inputTextPrice * inputTextTokens + inputImagePrice * inputImageTokens + outputImagePrice * outputImageTokens
      return totalPrice
  }

  applyQualityRunware(params) {
    const allowedQualities = ['auto', 'low', 'medium', 'high']
    if (!allowedQualities.includes(params.quality)) {
      throw new Error(`'quality' must be one of: ${allowedQualities.join(', ')}`)
    }
    params.openai_quality = params.quality
    return params
  }

  applyQuality(params) {
    const allowedQualities = ['auto', 'low', 'medium', 'high']
    if (!allowedQualities.includes(params.quality)) {
      throw new Error(`'quality' must be one of: ${allowedQualities.join(', ')}`)
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