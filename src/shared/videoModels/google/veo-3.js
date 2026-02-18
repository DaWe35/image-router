import { PRICING_TYPES } from '../../PricingScheme.js'
import { calcVideoPrice } from '../../../services/helpers.js'
import { applyImageSingleBase64, applyVertexImage } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'google/veo-3',
      providers: [
        {
          id: 'gemini',
          model_name: 'veo-3.0-generate-001',
          pricing: {
            type: PRICING_TYPES.CALCULATED,
            calcFunction: (params) => calcVideoPrice(params, 0.3), // official: 0.4 per second, 25% discount
            range: {
              min: 1.2,   // official: 1.6
              average: 1.2,
              max: 2.4    // official: 3.2
            }
          },
          applyImage: applyImageSingleBase64
        }, {
          id: 'vertex',
          model_name: 'veo-3.0-generate-001',
          pricing: {
            type: PRICING_TYPES.CALCULATED,
            calcFunction: (params) => calcVideoPrice(params, 0.3), // official: 0.4 per second, 25% discount
            range: {
              min: 1.2,   // official: 1.6
              average: 1.2,
              max: 2.4    // official: 3.2
            }
          },
          applyImage: applyImageSingleBase64
        },
        
        /* These have no input image implemented yet
        {
          id: 'replicate',
          model_name: 'google/veo-3',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 3.2
          }
        } */
      ],
      release_date: '2025-05-20',
      sizes: [
        '1280x720',
        '720x1280',
        '1920x1080',
        '1080x1920',
      ],
      seconds: [4, 6, 8],
      default_seconds: 4
    }
  }

  getData() {
    return this.data
  }
}
