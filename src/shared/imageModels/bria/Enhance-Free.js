import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageSingle } from '../../applyImage.js'

export default class EnhanceFree {
  constructor() {
    this.data = {
      id: 'bria/enhance:free',
      providers: [
        {
          id: 'deepinfra',
          model_name: 'Bria/enhance',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0,
          },
          applyImage: applyImageSingle
        }
      ],
      //release_date: '0000-00-00',
      examples: [
        {
          image: '/model-examples/enhance-2025-10-29T18-47-11-660Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}
