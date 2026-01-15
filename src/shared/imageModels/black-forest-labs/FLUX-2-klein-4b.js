import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'
import { applyInputImagesReferences, applyAccelerationRunware } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-2-klein-4b',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:400@4',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.0038,
              average: 0.0045,
              max: 0.0045
            }
          },
          applyImage: applyInputImagesReferences,
          applyQuality: applyAccelerationRunware,
        }
      ],
      release_date: '2026-01-15'
    }
  }

  getData() {
    return this.data
  }
}
