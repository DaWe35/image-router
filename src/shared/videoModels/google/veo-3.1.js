import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingleBase64 } from '../../applyImage.js'

export default class Veo31 {
  constructor() {
    this.data = {
      id: 'google/veo-3.1',
      providers: [
        {
          id: 'gemini',
          model_name: 'veo-3.1-generate-preview',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 3.2
          },
          applyImage: applyImageSingleBase64
        }
      ],
      arena_score: 1240,
      release_date: '2025-10-15'
    }
  }

  getData() {
    return this.data
  }
}