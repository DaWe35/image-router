import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'
import { applyInputImagesReferences } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-2-max',
      providers: [
        {
          id: 'runware',
          model_name: 'bfl:7@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.07,
              average: 0.07,
              max: 0.25
            }
          },
          applyImage: applyInputImagesReferences,
        }
      ],
      release_date: '2025-12-16',
    }
  }

  getData() {
    return this.data
  }
}
