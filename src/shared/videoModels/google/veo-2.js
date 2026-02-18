import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingleBase64 } from '../../applyImage.js'

class Veo2 {
  constructor() {
    this.data = {
      id: 'google/veo-2',
      providers: [{
        id: 'gemini',
        model_name: 'veo-2.0-generate-001',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 1.875, // official: 2.5 ($0.50/sec × 5s), 25% discount
        },
        applyImage: applyImageSingleBase64,
      }],
      release_date: '2024-12-16',
      sizes: [
        '1280x720',
        '720x1280',
        '1920x1080',
        '1080x1920',
      ],
      seconds: [5],
      default_seconds: 5
    }
  }

  getData() {
    return this.data
  }
}

export default Veo2 