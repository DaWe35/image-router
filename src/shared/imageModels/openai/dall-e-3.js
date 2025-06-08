import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class DallE3 {
  constructor() {
    this.data = {
      id: 'openai/dall-e-3',
      providers: [{
        id: 'openai',
        model_name: 'dall-e-3',
        pricing: {
          type: PRICING_TYPES.CALCULATED,
          calcFunction: this.calculatePrice,
          range: {
            min: this.calculatePrice('low'),
            average: this.calculatePrice('medium'),
            max: this.calculatePrice('high')
          },
        },
        applyQuality: this.applyQuality,
      }],
      size: {
        type: SIZE_TYPES.FIXED,
        options: ["1024x1024", "1024x1792", "1792x1024"],
        default: "1024x1024"
      },
      arena_score: 937,
      release_date: '2023-10-20',
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

  calculatePrice(quality, size) {
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

  applyQuality(params) {
    // 'low' and 'medium' and default map to 'standard', 'high' maps to 'hd'
    params.quality = (params.quality === 'high') ? 'hd' : 'standard'
    return params
  }
}

export default DallE3 