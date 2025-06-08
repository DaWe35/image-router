import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

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
            min: this.calculatePrice('low'),
            average: this.calculatePrice('medium'),
            max: this.calculatePrice('high')
          },
        },
        applyQuality: this.applyQuality
      }],
      size: {
        type: SIZE_TYPES.RANGE,
        min: "256x256",
        max: "1536x1536",
        default: "1024x1024"
      },
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
    else if (params.quality === 'medium') params.model = 'ideogram-ai/ideogram-v3-balanced'
    else if (params.quality === 'high') params.model = 'ideogram-ai/ideogram-v3-quality'
    else params.model = 'ideogram-ai/ideogram-v3-balanced'
    delete params.quality
    return params
  }

  calculatePrice(quality, size) {
    if (quality === 'low') return 0.04
    if (quality === 'medium') return 0.07
    if (quality === 'high') return 0.1
    return 0.07
  }
}

export default IdeogramV3