import { PRICING_TYPES } from '../../PricingScheme.js'
import { calcVideoPrice } from '../../../services/imageHelpers.js'
import { applyImageSingleBase64, applyVertexImage } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'google/veo-3',
      sizes: [
        '1024x1024',
        '832x1248',
        '1248x832',
        '864x1184',
        '1184x864',
        '896x1152',
        '1152x896',
        '768x1344',
        '1344x768',
        '1536x672',
      ],
      providers: [
        {
          id: 'gemini',
          model_name: 'veo-3.0-generate-001',
          pricing: {
            type: PRICING_TYPES.CALCULATED,
            calcFunction: (params) => calcVideoPrice(params, 0.4), // $0.4 per second ($3.2 per 8s)
            range: {
              min: 1.6,
              average: 1.6,
              max: 3.2
            }
          },
          applyImage: applyImageSingleBase64
        },
        /* These have no input image implemented yet
        {
          id: 'vertex',
          model_name: 'veo-3.0-generate-001',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 3.2
          },
          // applyImage: applyVertexImage
        }, {
          id: 'replicate',
          model_name: 'google/veo-3',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 3.2
          }
        } */
      ],
      release_date: '2025-05-20',
      seconds: [4, 6, 8],
      default_seconds: 4
    }
  }

  getData() {
    return this.data
  }
}
