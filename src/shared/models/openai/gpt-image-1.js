import { PRICING_TYPES } from '../../PricingScheme.js'

class GptImage1 {
  constructor() {
    this.data = {
      id: 'openai/gpt-image-1',
      providers: [{
        name: 'openai',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcPrice,
          range: {
            min: 0.011,
            average: 0.167,
            max: 0.5
          },
        }
      }],
      arenaScore: 1156,
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
}

export default GptImage1 