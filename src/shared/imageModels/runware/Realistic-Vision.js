import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'

class RealisticVision {
  constructor() {
    this.data = {
      id: 'asiryan/Realistic-Vision',
      providers: [{
        id: 'runware',
        model_name: 'civitai:4201@130072',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.0013,
            average: 0.0019,
            max: 0.0173
          }
        },
        applyQuality: this.applyQuality
      }],
      release_date: '2024-02-26'
    }
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 15,
      medium: 25,
      high: 50
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}

export default RealisticVision 