import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyInputImagesReferences } from '../../applyImage.js'

export default class Flux2Dev {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-2-dev',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:400@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.0045,
              average: 0.0109,
              max: 0.0275
            }
          },
          applyImage: applyInputImagesReferences,
        }
      ],
      arena_score: 1152,
      release_date: '2025-11-25'
    }
  }

  getData() {
    return this.data
  }
}
