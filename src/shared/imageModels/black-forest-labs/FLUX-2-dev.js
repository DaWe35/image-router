import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyInputImagesReferences } from '../../applyImage.js'

export default class Flux2Dev {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-2-dev',
      providers: [{
        id: 'runware',
        model_name: 'runware:400@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.012,
            average: 0.016,
            max: 0.1396
          }
        },
        applyImage: applyInputImagesReferences,
      }],
      release_date: '2025-11-25'
    }
  }

  getData() {
    return this.data
  }
}
