import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

class Flux11ProUltra {
  constructor() {
    this.data = {
      id: 'black-forest-labs/flux-1.1-pro-ultra',
      providers: [
        {
          id: 'runware',
          model_name: 'bfl:2@2',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.06
          }
        }, {
          id: 'replicate',
          model_name: 'black-forest-labs/flux-1.1-pro-ultra',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.06
          }
        }
      ],
      arena_score: 1101,
      release_date: '2024-11-06',
      sizes: [
        '3136x1344',
        '2752x1536',
        '2368x1792',
        '2496x1664',
        '2048x2048',
        '1664x2496',
        '1792x2368',
        '1536x2752',
        '1344x3136'
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Flux11ProUltra 