import { PRICING_TYPES } from '../../PricingScheme.js'

class Chroma {
  constructor() {
    this.data = {
      id: 'lodestones/Chroma',
      providers: [{
        id: 'chutes',
        model_name: 'chroma',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.01
        }
      }],
      release_date: '2025-06-09',
      examples: [
        {
          image: '/model-examples/Chroma-2025-06-23T10-29-27-458Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Chroma