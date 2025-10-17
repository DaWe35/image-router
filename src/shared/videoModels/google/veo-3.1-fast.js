import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingle } from '../../applyImage.js'

export default class Veo31Fast {
  constructor() {
    this.data = {
      id: 'google/veo-3.1-fast',
      providers: [
        {
          id: 'gemini',
          model_name: 'veo-3.1-fast-generate-preview',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 1.2,
          },
          applyImage: applyImageSingle,
        }
      ],
      release_date: '2025-10-15',
      examples: [
        {
          video: '/model-examples/veo-3.1-fast-2025-10-17T20-07-04-975Z.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}
