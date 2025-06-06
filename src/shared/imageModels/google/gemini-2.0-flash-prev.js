import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'
import Gemini20FlashExp from './gemini-2.0-flash-exp.js'

// Create an instance to access instance methods
const geminiInstance = new Gemini20FlashExp()

class Gemini20FlashPrev {
  constructor() {
    this.data = {
      id: 'google/gemini-2.0-flash-prev',
      providers: [{
        id: 'gemini',
        model_name: 'gemini-2.0-flash-preview-image-generation',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.039,
        },
        applyImage: geminiInstance.applyImage,
      }],
      size: {
        type: SIZE_TYPES.RANGE,
        min: "256x256",
        max: "1536x1536",
        default: "1024x1024"
      },
      arena_score: 980,
      release_date: '2025-05-07',
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