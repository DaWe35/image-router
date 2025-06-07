import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class Veo2 {
  constructor() {
    this.data = {
      id: 'google/veo-2-mock',
      providers: [{
        id: 'geminiMock',
        model_name: 'google/veo-2-mock',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.00,
        },
      }],
      size: {
        type: SIZE_TYPES.FIXED,
        options: ["720x1280", "1280x720", "1280x1280"],
        default: "1280x720"
      },
      arena_score: 1127,
      release_date: '2024-12-16',
      examples: [
        {
          video: '/model-examples/veo-2-2025-05-27T22-57-10-794Z.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Veo2 