import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageSingle } from '../../applyImage.js'

export default class Erase {
  constructor() {
    this.data = {
      id: 'bria/erase',
      providers: [
        {
          id: 'deepinfra',
          model_name: 'Bria/erase',
          pricing: {
            /* type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple, */
            type: PRICING_TYPES.FIXED,
            value: 0.0005
          },
          applyImage: applyImageSingle
        }
      ],
      /* release_date: '0000-00-00',
       */
    }
  }

  getData() {
    return this.data
  }
}
