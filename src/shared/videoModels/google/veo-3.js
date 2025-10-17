import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingle, applyVertexImage } from '../../applyImage.js'

export default class Veo3 {
  constructor() {
    this.data = {
      id: 'google/veo-3',
      providers: [
        {
          id: 'gemini',
          model_name: 'veo-3.0-generate-001',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 3.2,
          },
          applyImage: applyImageSingle,
        },
        /* These have no input image implemented yet
        {
          id: 'vertex',
          model_name: 'veo-3.0-generate-001',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 3.2,
          },
          // applyImage: applyVertexImage
        }, {
          id: 'replicate',
          model_name: 'google/veo-3',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 3.2,
          }
        } */
      ],
      arena_score: 1240,
      release_date: '2025-05-20',
      examples: [
        {
          video: '/model-examples/veo-3-2025-10-17T20-15-10-023Z.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}
