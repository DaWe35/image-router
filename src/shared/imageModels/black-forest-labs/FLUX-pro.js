import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

class FluxPro {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-pro',
      providers: [{
        id: 'deepinfra',
        model_name: 'black-forest-labs/FLUX-pro',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          value: 0.05
        },
        applyQuality: this.applyQuality
      }],
      arena_score: 1069,
      release_date: '2024-08-01'
      
    }
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 15,
      medium: 25,
      high: 45
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}

export default FluxPro 