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
}

export default GptImage1 