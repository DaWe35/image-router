import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'

export default class {
  constructor() {
    this.data = {
      id: 'imagineart/imagineart-1.5',
      providers: [{
        id: 'runware',
        model_name: 'imagineart:1@5',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          value: 0.03
        }
      }],
      release_date: '2025-11-14',
      sizes: [
        '2048x2048',
        /* '2560x1440', // not working rn
        '1440x2560',
        '2304x1728',
        '1728x2304',
        '2472x824',
        '824x2472',
        '1728x1152',
        '1152x1728' */
      ]
    }
  }

  getData() {
    return this.data
  }
}
