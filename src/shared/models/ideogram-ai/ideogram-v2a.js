import { PRICING_TYPES } from '../../PricingScheme.js'

class IdeogramV2a {
  constructor() {
    this.data = {
      id: 'ideogram-ai/ideogram-v2a',
      providers: [{
        id: 'replicate',
        pricing: {
          type: PRICING_TYPES.CALCULATED,
          calcFunction: this.calculatePrice,
          range: {
            min: this.calculatePrice('low'),
            average: this.calculatePrice('medium'),
            max: this.calculatePrice('high')
          }
        },
        getModelToUse: this.getModelToUse
      }],
      arena_score: 997,
      release_date: '2025-02-27',
      examples: [
        {
          image: '/model-examples/ideogram-v2a-2025-04-03T15-10-14-620Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
  
  getModelToUse(quality) {
    if (quality === 'low') return 'ideogram-ai/ideogram-v2a-turbo'
    return 'ideogram-ai/ideogram-v2a'
  }

  calculatePrice(quality) {
    if (quality === 'low') return 0.025
    return 0.04
  }
}

export default IdeogramV2a 