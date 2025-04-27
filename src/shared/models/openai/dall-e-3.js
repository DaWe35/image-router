import { PRICING_TYPES } from '../../PricingScheme.js'

class DallE3 {
  constructor() {
    this.data = {
      id: 'openai/dall-e-3',
      providers: [{
        id: 'openai',
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
      arenaScore: 927,
      examples: [
        {
          image: '/model-examples/dall-e-3.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  calculatePrice(quality) {
    // 1024x1024
    switch (quality) {
      case 'high':
        return 0.08
      case 'low':
      case 'medium':
      default:
        return 0.04
    }
  }

  applyQuality(params, quality) {
    // 'low' and 'medium' and default map to 'standard', 'high' maps to 'hd'
    params.quality = (quality === 'high') ? 'hd' : 'standard'
    return params
  }
}

export default DallE3 