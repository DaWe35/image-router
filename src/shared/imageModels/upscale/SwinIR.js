import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'
import { applySingleInputImage } from '../../applyImage.js'


class SwinIR {
  constructor() {
    this.data = {
      id: 'jingyunliang/swinir-2x',
      providers: [{
        id: 'runware',
        model_name: 'runware:503@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.0006,
            average: 0.0045,
            max: 0.0045
          },
        },
        applyImage: applySingleInputImage
      }],
      release_date: '2021-09-30'
    }
  }

  getData() {
    return this.data
  }
}

export default SwinIR 