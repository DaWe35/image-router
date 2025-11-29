import { PRICING_TYPES } from '../../PricingScheme.js'

class IdeogramV3Turbo {
  constructor() {
    this.data = {
      id: 'ideogram-ai/ideogram-v3-turbo',
      providers: [{
        id: 'replicate',
        model_name: 'ideogram-ai/ideogram-v3-turbo',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.03
        }
      }],
      release_date: '2025-03-26',
      
    }
  }

  getData() {
    return this.data
  }
}

export default IdeogramV3Turbo