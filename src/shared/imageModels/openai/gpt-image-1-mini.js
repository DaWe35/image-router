import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles, processSingleFile, postCalcNanoGPTDiscounted10 } from '../../../services/imageHelpers.js'
import { applyImageNanoGPT } from '../../applyImage.js'

class GptImage1Mini {
  constructor() {
    this.data = {
      id: 'openai/gpt-image-1-mini',
      providers: [
        {
          id: 'nanogpt',
          model_name: 'gpt-image-1-mini',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcNanoGPTDiscounted10,
            range: {
              min: 0.005,
              average: 0.011,
              max: 0.015
            },
          },
          applyQuality: this.applyQuality,
          applyImage: applyImageNanoGPT,
        }, {
          id: 'openai',
          model_name: 'gpt-image-1-mini',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: this.postCalcPrice,
            range: {
              min: 0.005,
              average: 0.011,
              max: 0.015
            },
          },
          applyQuality: this.applyQuality,
          applyImage: this.applyImage,
          applyMask: this.applyMask,
        }
      ],
      release_date: '2025-10-06',
      sizes: [
        '1024x1024',
        '1536x1024',
        '1024x1536'
      ]
    }
  }

  getData() {
    return this.data
  }

  postCalcPrice(imageResult) {
      const inputTextPrice = 0.000002
      const inputImagePrice = 0.0000025
      const outputImagePrice = 0.000008

      const inputTextTokens = imageResult.usage.input_tokens_details.text_tokens
      const inputImageTokens = imageResult.usage.input_tokens_details.image_tokens
      const outputImageTokens = imageResult.usage.output_tokens

      const totalPrice = inputTextPrice * inputTextTokens + inputImagePrice * inputImageTokens + outputImagePrice * outputImageTokens
      return totalPrice
  }

  applyQuality(params) {
    const allowedQualities = ['auto', 'low', 'medium']
    if (allowedQualities.includes(params.quality)) {
      params.quality = params.quality
    } else {
      throw new Error(`This 'quality' is not supported for this model. Must be one of: ${allowedQualities.join(', ')}`)
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

export default GptImage1Mini