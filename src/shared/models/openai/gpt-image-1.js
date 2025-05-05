import fs from 'fs'
import { PRICING_TYPES } from '../../PricingScheme.js'

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

  applyImage(params) {
    if (Array.isArray(params.files.image)) {
      // For multiple images, add each image stream to an array
      // The objectToFormData function will handle appending each image with the same key
      params.image = params.files.image
    } else {
      // For a single image, return the path to the image file
      params.image = params.files.image
    }

    delete params.files.image
    return params
  }

  applyMask(params) {
    params.mask = params.files.mask
    delete params.files.mask
    return params
  }
}

export default GptImage1 