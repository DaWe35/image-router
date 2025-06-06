import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'
import Gemini20FlashExp from './gemini-2.0-flash-exp.js'

// Create an instance to access instance methods
const geminiInstance = new Gemini20FlashExp()

class Gemini20FlashExpFree {
  constructor() {
    this.data = {
      id: 'google/gemini-2.0-flash-exp:free',
      providers: [{
        id: 'gemini',
        model_name: 'gemini-2.0-flash-exp-image-generation',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0,
        },
        applyImage: geminiInstance.applyImage,
      }],
      size: {
        type: SIZE_TYPES.RANGE,
        min: "256x256",
        max: "1536x1536",
        default: "1024x1024"
      },
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