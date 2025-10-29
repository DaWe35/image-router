import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applySingleInputImage, applyImageSingle } from '../../applyImage.js'

export default class RemoveBackground {
  constructor() {
    this.data = {
      id: 'bria/remove-background',
      providers: [
        {
          id: 'deepinfra',
          model_name: 'Bria/remove_background',
          pricing: {
            /* type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple, */
            type: PRICING_TYPES.FIXED,
            value: 0.0005,
          },
          applyImage: applyImageSingle
        }, {
          id: 'runware',
          model_name: 'runware:110@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.0006,
          },
          applyImage: applySingleInputImage
        }
      ],
      release_date: '2024-10-30',
      examples: [
        {
          image: '/model-examples/RMBG-2.0-2025-07-12T14-12-11-026Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}
