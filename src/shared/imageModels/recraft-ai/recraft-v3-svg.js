import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class RecraftV3Svg {
  constructor() {
    this.data = {
      id: 'recraft-ai/recraft-v3-svg',
      providers: [{
        id: 'replicate',
        model_name: 'recraft-ai/recraft-v3-svg',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.08,
        }
      }],
      size: {
        type: SIZE_TYPES.FIXED,
        options: ["1024x1024", "1365x1024", "1024x1365", "1536x1024", "1024x1536", "1820x1024", "1024x1820", "1024x2048", "2048x1024", "1434x1024", "1024x1434", "1024x1280", "1280x1024", "1024x1707", "1707x1024"],
        default: "1024x1024"
      },
      arena_score: null,
      release_date: '2024-10-30',
      examples: [
        {
          image: '/model-examples/recraft-v3-svg-2025-04-03T15-34-40-865Z.svg'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default RecraftV3Svg 