import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingle } from '../../applyImage.js'

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
            value: 3.2,
          },
          applyImage: applyImageSingle,
        }
      ],
      arena_score: 1240,
      release_date: '2025-10-15',
      examples: [
        {
          video: '/model-examples/veo-3.1-2025-10-17T20-15-08-870Z.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}