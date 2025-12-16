import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles, processSingleFile, postCalcNanoGPTDiscounted10, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageNanoGPT, applyInputImagesReferences } from '../../applyImage.js'

class GptImage1Mini {
  constructor() {
    this.data = {
      id: 'openai/gpt-image-1-mini',
      providers: [
        // Runware is incompatible, it DOES NOT SUPPORT QUALITY === 'auto'
        /* {
          id: 'runware',
          model_name: 'openai:1@2',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.009,
              average: 0.051,
              max: 0.2
            },
          },
          applyQuality: this.applyQualityRunware,
          applyImage: applyInputImagesReferences,
        }, */
        {
          id: 'openai',
          model_name: 'gpt-image-1-mini',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: this.postCalcPrice,
            range: {
              min: 0.005,
              average: 0.011,
              max: 0.0569
            },
          },
          applyQuality: this.applyQuality,
          applyImage: this.applyImage,
          applyMask: this.applyMask,
        }, {
          id: 'nanogpt',
          model_name: 'gpt-image-1-mini',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcNanoGPTDiscounted10,
            range: {
              min: 0.005,
              average: 0.011,
              max: 0.0569
            },
          },
          applyQuality: this.applyQuality,
          applyImage: applyImageNanoGPT,
        }
      ],
      release_date: '2025-10-06',
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
      const inputTextPrice = 0.000002
      const inputImagePrice = 0.0000025
      const outputImagePrice = 0.000008

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

export default GptImage1Mini