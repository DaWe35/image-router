import { PRICING_TYPES } from '../../PricingScheme.js'
import Gemini20FlashExp from './gemini-2.0-flash-exp.js'

class Gemini20FlashPrev {
  constructor() {
    this.data = {
      id: 'google/gemini-2.0-flash-prev',
      aliasOf: 'gemini-2.0-flash-preview-image-generation',
      providers: [{
        id: 'google',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.039,
        },
        applyImage: Gemini20FlashExp.applyImage,
      }],
      arena_score: 980,
      examples: [
        {
          image: '/model-examples/gemini-2.0-flash-prev-2025-05-13T11-25-55-222Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Gemini20FlashPrev 