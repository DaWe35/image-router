import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'
import { applyInputImagesReferences } from '../../applyImage.js'

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
              min: 0.0006,
              average: 0.0006,
              max: 0.0032
            }
          },
          applyImage: applyInputImagesReferences,
          applyQuality: this.applyQuality,
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
      low: 2,
      medium: 4,
      high: 8
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }
}
