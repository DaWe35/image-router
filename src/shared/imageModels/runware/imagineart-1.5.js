import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

export default class ImagineArt15 {
  constructor() {
    this.data = {
      id: 'imagineart/imagineart-1.5',
      providers: [{
        id: 'runware',
        model_name: 'imagineart:1@5',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          value: 0.01
        }
      }],
      release_date: '2025-11-14'
    }
  }

  getData() {
    return this.data
  }
}
