import { PRICING_TYPES } from '../../PricingScheme.js'
import { calcVideoPrice } from '../../../services/imageHelpers.js'
import { applyImageSingleBase64 } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'google/veo-3.1',
      providers: [
        {
          id: 'gemini',
          model_name: 'veo-3.1-generate-preview',
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
        }
      ],
      release_date: '2025-10-15',
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