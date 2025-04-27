import { PRICING_TYPES } from '../../PricingScheme.js'

class DallE2 {
  constructor() {
    this.data = {
      id: 'openai/dall-e-2',
      providers: [{
        name: 'openai',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.02,
        }
      }],
      arenaScore: 714,
      examples: [
        {
          image: '/model-examples/dall-e-2.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default DallE2 