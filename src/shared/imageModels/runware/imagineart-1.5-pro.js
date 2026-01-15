import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'

export default class {
  constructor() {
    this.data = {
      id: 'imagineart/imagineart-1.5-pro',
      providers: [{
        id: 'runware',
        model_name: 'imagineart:1.5-pro@0',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          value: 0.045
        }
      }],
      release_date: '2026-01-15',
      sizes: [
        '4096x4096',
        '2880x5120',
        '5120x2880',
        '4608x3072',
        '3072x4608',
        '4448x3328',
        '3328x4448',
        '6592x2200',
        '2200x6592'
      ]
    }
  }

  getData() {
    return this.data
  }
}
