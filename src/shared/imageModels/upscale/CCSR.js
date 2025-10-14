import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applySingleInputImage } from '../../applyImage.js'


class CCSR {
  constructor() {
    this.data = {
      id: 'csslc/ccsr-2x',
      providers: [{
        id: 'runware',
        model_name: 'runware:501@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.0013,
            average: 0.0083,
            max: 0.0103
          },
        },
        applyImage: applySingleInputImage
      }],
      release_date: '2024-12-12'
    }
  }

  getData() {
    return this.data
  }
}

export default CCSR 