import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'

class JuggernautFlux {
  constructor() {
    this.data = {
      id: 'run-diffusion/Juggernaut-Flux',
      providers: [{
        id: 'runware',
        model_name: 'rundiffusion:120@100',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.0025,
            average: 0.005,
            max: 0.038
          }
        },
        applyQuality: this.applyQuality
      }],
      release_date: '2025-03-05'
    }
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 10,
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

export default JuggernautFlux 