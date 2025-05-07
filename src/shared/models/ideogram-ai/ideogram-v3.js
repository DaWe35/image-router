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
        applyQuality: this.applyQuality
      }],
      arena_score: 1088,
      release_date: '2025-03-26',
      examples: [
        {
          image: '/model-examples/ideogram-v3-2025-05-06T13-16-26-069Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  applyQuality(params) {
    if (params.quality === 'low') params.model = 'ideogram-ai/ideogram-v3-turbo'
    if (params.quality === 'medium') params.model = 'ideogram-ai/ideogram-v3-balanced'
    if (params.quality === 'high') params.model = 'ideogram-ai/ideogram-v3-quality'
    params.model = 'ideogram-ai/ideogram-v3-balanced'
    delete params.quality
    return params
  }

  calculatePrice(quality) {
    if (quality === 'low') return 0.04
    if (quality === 'medium') return 0.07
    if (quality === 'high') return 0.1
    return 0.07
  }
}

export default IdeogramV3