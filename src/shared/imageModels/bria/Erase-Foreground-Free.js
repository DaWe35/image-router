import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageSingle } from '../../applyImage.js'

export default class EraseForegroundFree {
  constructor() {
    this.data = {
      id: 'bria/erase-foreground:free',
      providers: [
        {
          id: 'deepinfra',
          model_name: 'Bria/erase_foreground',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0,
          },
          applyImage: applyImageSingle
        }
      ],
      //release_date: '0000-00-00'
    }
  }

  getData() {
    return this.data
  }
}
