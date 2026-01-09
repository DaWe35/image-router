import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingleBase64 } from '../../applyImage.js'

class Veo2 {
  constructor() {
    this.data = {
      id: 'google/veo-2',
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
      providers: [{
        id: 'gemini',
        model_name: 'veo-2.0-generate-001',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 1.75,
        },
        applyImage: applyImageSingleBase64,
      }],
      release_date: '2024-12-16',
      seconds: [5],
      default_seconds: 5
    }
  }

  getData() {
    return this.data
  }
}

export default Veo2 