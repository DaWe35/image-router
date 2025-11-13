import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple, processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

class Sora2 {
  constructor() {
    this.data = {
      id: 'openai/sora-2',
      providers: [{
        id: 'runware',
        model_name: 'openai:3@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          value: 0.4
        },
        applyImage: applyImageRunwareVideo
      }],
      release_date: '2025-09-30'
    }
  }

  getData() {
    return this.data
  }
}

export default Sora2
