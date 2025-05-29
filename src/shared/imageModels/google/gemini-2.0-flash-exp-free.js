import { PRICING_TYPES } from '../../PricingScheme.js'
import Gemini20FlashExp from './gemini-2.0-flash-exp.js'

// Create an instance to access instance methods
const geminiInstance = new Gemini20FlashExp()

class Gemini20FlashExpFree {
  constructor() {
    this.data = {
      id: 'google/gemini-2.0-flash-exp:free',
      aliasOf: 'gemini-2.0-flash-exp-image-generation',
      providers: [{
        id: 'gemini',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0,
        },
        applyImage: geminiInstance.applyImage,
      }],
      arena_score: 962,
      release_date: '2025-03-12',
      examples: [
        {
          image: '/model-examples/gemini-2.0-flash-exp_free-2025-05-13T11-23-59-032Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Gemini20FlashExpFree 