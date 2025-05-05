import { PRICING_TYPES } from '../../PricingScheme.js'

class IdeogramV3 {
  constructor() {
    this.data = {
      id: 'ideogram-ai/ideogram-v3',
      providers: [{
        id: 'replicate',
        pricing: {
          type: PRICING_TYPES.CALCULATED,
          calcFunction: this.calculatePrice,
          range: {
            min: this.calculatePrice('low'),
            average: this.calculatePrice('medium'),
            max: this.calculatePrice('high')
          },
        },
        getModelToUse: this.getModelToUse
      }],
      arena_score: 1088,
      release_date: '2025-03-26',
      examples: [
        {
          image: ''
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  getModelToUse(quality) {
    if (quality === 'low') return 'ideogram-ai/ideogram-v3-turbo'
    if (quality === 'medium') return 'ideogram-ai/ideogram-v3-balanced'
    if (quality === 'high') return 'ideogram-ai/ideogram-v3-quality'
    return 'ideogram-ai/ideogram-v3-balanced'
  }

  calculatePrice(quality) {
    if (quality === 'low') return 0.04
    if (quality === 'medium') return 0.07
    if (quality === 'high') return 0.1
    return 0.07
  }
}

export default IdeogramV3