import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcRunware } from '../../../services/imageHelpers.js'
import { applySingleInputImage } from '../../applyImage.js'


class RMBG20 {
  constructor() {
    this.data = {
      id: 'briaai/RMBG-2.0',
      providers: [{
        id: 'runware',
        model_name: 'runware:110@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcRunware,
          range: {
            min: 0.0006,
            average: 0.0006,
            max: 0.0038
          }
        },
        applyImage: applySingleInputImage
      }],
      release_date: '2024-10-30',
      examples: [
        {
          image: '/model-examples/RMBG-2.0-2025-07-12T14-12-11-026Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default RMBG20 