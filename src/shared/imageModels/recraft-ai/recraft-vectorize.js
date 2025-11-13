import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyFalImage } from '../../applyImage.js'

class RecraftVectorize {
  constructor() {
    this.data = {
      id: 'recraft-ai/recraft-vectorize',
      providers: [{
        id: 'fal',
        model_name: 'fal-ai/recraft/vectorize',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.01
        },
        applyImage: applyFalImage
      }],
      release_date: '2024-10-30'
    }
  }

  getData() {
    return this.data
  }
}

export default RecraftVectorize