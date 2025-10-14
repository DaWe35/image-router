import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applySingleInputImage } from '../../applyImage.js'


class Clarity {
  constructor() {
    this.data = {
      id: 'philz1337x/clarity-2x',
      providers: [{
        id: 'runware',
        model_name: 'runware:500@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.0006,
            average: 0.0038,
            max: 0.0045
          },
        },
        applyImage: applySingleInputImage
      }],
      release_date: '2024-03-15'
    }
  }

  getData() {
    return this.data
  }
}

export default Clarity 