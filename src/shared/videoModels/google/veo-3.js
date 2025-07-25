import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyVertexImage } from '../../applyImage.js'

class Veo3 {
  constructor() {
    this.data = {
      id: 'google/veo-3',
      providers: [
        {
          id: 'vertex',
          model_name: 'veo-3.0-generate-preview',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 6,
          },
          /* applyImage: applyVertexImage */
        }, {
          id: 'replicate',
          model_name: 'google/veo-3',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 6,
          }
        }
      ],
      arena_score: 1240,
      release_date: '2025-05-20',
      examples: [
        {
          video: '/model-examples/veo-3.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Veo3 