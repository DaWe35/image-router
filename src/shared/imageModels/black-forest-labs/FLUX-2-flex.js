import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyInputImagesReferences } from '../../applyImage.js'

export default class Flux2Flex {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-2-flex',
      providers: [{
        id: 'runware',
        model_name: 'bfl:6@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.06,
            average: 0.06,
            max: 0.12
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
