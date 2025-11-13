import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles, processSingleFile, postCalcNanoGPTDiscounted5 } from '../../../services/imageHelpers.js'

export default class LucidOrigin {
  constructor() {
    this.data = {
      id: 'leonardoai/lucid-origin',
      providers: [
        {
            id: 'replicate',
            model_name: 'leonardoai/lucid-origin',
            pricing: {
              type: PRICING_TYPES.FIXED,
              value: 0.02,
            }
        }, {
          id: 'nanogpt',
          model_name: 'lucid-origin',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcNanoGPTDiscounted5,
            value: 0.03
          },
          applyQuality: this.applyQuality,
        }
      ],
      release_date: '2025-08-05'
    }
  }

  getData() {
    return this.data
  }
}
