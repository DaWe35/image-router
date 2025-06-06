import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class Veo3 {
  constructor() {
    this.data = {
      id: 'google/veo-3',
      providers: [{
        id: 'vertex',
        model_name: 'veo-3.0-generate-preview',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 4, // price with no audio generated
        },
      }],
      size: {
        type: SIZE_TYPES.FIXED,
        options: ["720x1280", "1280x720", "1280x1280"],
        default: "1280x720"
      },
      arena_score: 1246,
      release_date: '2025-05-20',
      examples: [
        {
          video: '/model-examples/veo-3-2025-01-01T00-00-00-000Z.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Veo3 