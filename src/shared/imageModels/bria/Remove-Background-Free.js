import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'
import { applySingleInputImage, applyImageSingle } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'bria/remove-background:free',
      providers: [
        {
          id: 'deepinfra',
          model_name: 'Bria/remove_background',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0,
          },
          applyImage: applyImageSingle
        }, {
          id: 'runware',
          model_name: 'runware:110@1',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0,
          },
          applyImage: applySingleInputImage
        }
      ],
      release_date: '2024-10-30'
    }
  }

  getData() {
    return this.data
  }
}
