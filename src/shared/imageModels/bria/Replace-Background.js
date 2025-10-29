import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageSingle } from '../../applyImage.js'

export default class ReplaceBackground {
  constructor() {
    this.data = {
      id: 'bria/replace-background',
      providers: [
        {
          id: 'deepinfra',
          model_name: 'Bria/replace_background',
          pricing: {
            /* type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple, */
            type: PRICING_TYPES.FIXED,
            value: 0.0005,
          },
          applyImage: applyImageSingle
        }
      ],
      /* release_date: '0000-00-00',
      examples: [
        {
          image: '/model-examples/RMBG-2.0-2025-07-12T14-12-11-026Z.webp'
        }
      ] */
    }
  }

  getData() {
    return this.data
  }
}
