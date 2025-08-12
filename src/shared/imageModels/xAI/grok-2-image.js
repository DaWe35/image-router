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
      arena_score: 929,
      release_date: '2024-12-12',
      examples: [
        {
          image: '/model-examples/grok-2-image-2025-08-12T09-11-22-200Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Grok2Image


