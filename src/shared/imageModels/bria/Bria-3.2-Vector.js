import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageSingle } from '../../applyImage.js'

export default class Bria32Vector {
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
            value: 0.0005,
          }
        }
      ],
      //release_date: '0000-00-00',
      examples: [
        {
          image: '/model-examples/bria-3.2-vector-2025-10-29T18-47-15-940Z.svg'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}
