import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageSingle } from '../../applyImage.js'

export default class BlurBackgroundFree {
  constructor() {
    this.data = {
      id: 'bria/blur-background:free',
      providers: [
        {
          id: 'deepinfra',
          model_name: 'Bria/blur_background',
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
          image: '/model-examples/blur-background-2025-10-29T18-47-12-530Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}
