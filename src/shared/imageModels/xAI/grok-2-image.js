import { PRICING_TYPES } from '../../PricingScheme.js'

class Grok2Image {
  constructor() {
    this.data = {
      id: 'xAI/grok-2-image',
      providers: [{
        id: 'grok',
        model_name: 'grok-2-image',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.07
        }
      }],
      release_date: '2024-12-12'
    }
  }

  getData() {
    return this.data
  }
}

export default Grok2Image

