import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'
import { applyImageSingle } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'bria/bria-3.2-vector',
      providers: [
        {
          id: 'deepinfra',
          model_name: 'Bria/Bria-3.2-vector',
          pricing: {
            /* type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple, */
            type: PRICING_TYPES.FIXED,
            value: 0.04,
          }
        }
      ],
      //release_date: '0000-00-00'
    }
  }

  getData() {
    return this.data
  }
}
