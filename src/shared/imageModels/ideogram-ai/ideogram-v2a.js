import { PRICING_TYPES } from '../../PricingScheme.js'

class IdeogramV2a {
  constructor() {
    this.data = {
      id: 'ideogram-ai/ideogram-v2a',
      providers: [{
        id: 'replicate',
        model_name: 'ideogram-ai/ideogram-v2a',
        pricing: {
          type: PRICING_TYPES.CALCULATED,
          calcFunction: this.calculatePrice,
          range: {
            min: this.calculatePrice({'quality': 'low'}),
            average: this.calculatePrice({'quality': 'medium'}),
            max: this.calculatePrice({'quality': 'high'})
          }
        },
        applyQuality: this.applyQuality
      }],
      arena_score: 1004,
      release_date: '2025-02-27'
    }
  }

  getData() {
    return this.data
  }
  
  applyQuality(params) {
    if (params.quality === 'low') params.model = 'ideogram-ai/ideogram-v2a-turbo'
    else params.model = 'ideogram-ai/ideogram-v2a'
    delete params.quality
    return params
  }

  calculatePrice(params) {
    if (params.quality === 'low') return 0.025
    return 0.04
  }
}

export default IdeogramV2a