import { PRICING_TYPES } from '../../PricingScheme.js'

class DallE3 {
  constructor() {
    this.data = {
      id: 'openai/dall-e-3',
      sizes: [
        '1024x1024',
        '1024x1536',
        '1536x1024',
      ],
      providers: [{
        id: 'openai',
        model_name: 'dall-e-3',
        pricing: {
          type: PRICING_TYPES.CALCULATED,
          calcFunction: this.calculatePrice,
          range: {
            min: this.calculatePrice({'quality': 'low', 'size': '1024x1024'}),
            average: this.calculatePrice({'quality': 'auto', 'size': '1024x1024'}),
            average: this.calculatePrice({'quality': 'auto', 'size': '1024x1024'}),
            max: this.calculatePrice({'quality': 'high', 'size': '1536x1024'})
          },
        },
        applyQuality: this.applyQuality,
      }],
      arena_score: 937,
      release_date: '2023-10-20'
    }
  }

  getData() {
    return this.data
  }

  calculatePrice(params) {
    const isHD = params.quality === 'high'

    if (isHD) {
        switch (params.size) {
            case '1024x1024':
                return 0.08
            case '1024x1536':
            case '1536x1024':
                return 0.12
            default:
                return 0.08 // Default to 1024x1024 if size is unknown
        }
    } else { // Standard quality
        switch (params.size) {
            case '1024x1024':
                return 0.04
            case '1024x1536':
            case '1536x1024':
                return 0.08
            default:
                return 0.04 // Default to 1024x1024 if size is unknown
        }
    }
  }

  applyQuality(params) {
    // 'low' and 'medium' and default map to 'standard', 'high' maps to 'hd'
    params.quality = (params.quality === 'high') ? 'hd' : 'standard'
    return params
  }
}

export default DallE3 