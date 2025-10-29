import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageSingle } from '../../applyImage.js'

export default class Bria32Free {
  constructor() {
    this.data = {
      id: 'bria/bria-3.2:free',
      providers: [
        {
          id: 'deepinfra',
          model_name: 'Bria/Bria-3.2',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0,
          }
        }
      ],
      //release_date: '0000-00-00',
      examples: [
        {
          image: '/model-examples/bria-3.2-2025-10-29T18-47-14-240Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}
