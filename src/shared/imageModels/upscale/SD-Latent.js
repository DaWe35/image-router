import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applySingleInputImage } from '../../applyImage.js'


class SDLatent {
  constructor() {
    this.data = {
      id: 'stabilityai/latent-2x',
      providers: [{
        id: 'runware',
        model_name: 'runware:502@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.0013,
            average: 0.0038,
            max: 0.0038
          },
        },
        applyImage: applySingleInputImage
      }],
      release_date: '2023-02-02'
    }
  }

  getData() {
    return this.data
  }
}

export default SDLatent 