import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles, processSingleFile, postCalcNanoGPTDiscounted } from '../../../services/imageHelpers.js'

class GptImage1 {
  constructor() {
    this.data = {
      id: 'openai/gpt-image-1',
      providers: [
        /* {
          id: 'nanogpt',
          model_name: 'gpt-image-1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcNanoGPTDiscounted,
            range: {
              min: 0.011,
              average: 0.167,
              max: 0.3
            },
          },
          applyQuality: this.applyQuality,
          applyImage: this.applyImageNanoGPT,
        }, */ {
          id: 'openai',
          model_name: 'gpt-image-1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: this.postCalcPrice,
            range: {
              min: 0.011,
              average: 0.167,
              max: 0.3
            },
          },
          applyQuality: this.applyQuality,
          applyImage: this.applyImage,
          applyMask: this.applyMask,
        }
      ],
      arena_score: 1151,
      release_date: '2025-04-23',
      examples: [
        {
          image: '/model-examples/gpt-image-1-2025-06-15T21-37-41-776Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
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
    const allowedQualities = ['auto', 'low', 'medium', 'high']
    if (allowedQualities.includes(params.quality)) {
      params.quality = params.quality
    } else {
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

  async applyImageNanoGPT(params) {
    params.image = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    delete params.files.image
    return params
  }
}

export default GptImage1