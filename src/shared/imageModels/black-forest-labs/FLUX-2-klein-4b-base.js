import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'
import { applyInputImagesReferences } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-2-klein-4b-base',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:400@5',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.0006,
              average: 0.0013,
              max: 0.0102
            }
          },
          applyImage: applyInputImagesReferences,
          applyQuality: this.applyQUality,
        }
      ],
      release_date: '2026-01-15'
    }
  }

  getData() {
    return this.data
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 18,
      medium: 28,
      high: 45
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }
}
