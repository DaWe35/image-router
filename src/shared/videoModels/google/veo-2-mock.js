import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/imageHelpers.js'

class Veo2 {
  constructor() {
    this.data = {
      id: 'google/veo-2-mock',
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
        id: 'geminiMock',
        model_name: 'veo-2.0-generate-001',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0
        },
        applyImage: this.applyImage
      }],
      release_date: '2024-12-16'
    }
  }

  getData() {
    return this.data
  }

  async applyImage(params) {
    params.image = await processSingleFile(params.files.image)
    delete params.files.image
    return params
  }
}

export default Veo2 