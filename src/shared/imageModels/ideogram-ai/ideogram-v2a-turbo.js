import { PRICING_TYPES } from '../../PricingScheme.js'

class IdeogramV2aTurbo {
  constructor() {
    this.data = {
      id: 'ideogram-ai/ideogram-v2a-turbo',
      providers: [{
        id: 'replicate',
        model_name: 'ideogram-ai/ideogram-v2a-turbo',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.025
        },
      }],
      release_date: '2025-02-27',
      examples: [
        {
          image: '/model-examples/ideogram-v2a-turbo-2025-10-13.webp'
        }
      ],
    }
  }

  getData() {
    return this.data
  }
}

export default IdeogramV2aTurbo