import { PRICING_TYPES } from '../../PricingScheme.js'

class IdeogramV3 {
  constructor() {
    this.data = {
      id: 'ideogram-ai/ideogram-v3',
      providers: [{
        id: 'replicate',
        model_name: 'ideogram-ai/ideogram-v3',
        pricing: {
          type: PRICING_TYPES.CALCULATED,
          calcFunction: this.calculatePrice,
          range: {
            min: this.calculatePrice({'quality': 'low'}),
            average: this.calculatePrice({'quality': 'medium'}),
            max: this.calculatePrice({'quality': 'high'})
          },
        },
        applyQuality: this.applyQuality
      }],
      arena_score: 1093,
      release_date: '2025-03-26'
    }
  }

  getData() {
    return this.data
  }

  applyQuality(params) {
    if (params.quality === 'low') params.model = 'ideogram-ai/ideogram-v3-turbo'
    else if (params.quality === 'medium') params.model = 'ideogram-ai/ideogram-v3-balanced'
    else if (params.quality === 'high') params.model = 'ideogram-ai/ideogram-v3-quality'
    else params.model = 'ideogram-ai/ideogram-v3-balanced'
    delete params.quality
    return params
  }

  calculatePrice(params) {
    if (params.quality === 'low') return 0.03
    if (params.quality === 'medium') return 0.06
    if (params.quality === 'high') return 0.09
    return 0.06
  }
}

export default IdeogramV3