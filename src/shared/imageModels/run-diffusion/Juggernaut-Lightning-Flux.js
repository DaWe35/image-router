import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'

class JuggernautLightningFlux {
  constructor() {
    this.data = {
      id: 'run-diffusion/Juggernaut-Lightning-Flux',
      providers: [{
        id: 'runware',
        model_name: 'rundiffusion:110@101',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.0008,
            average: 0.0017,
            max: 0.0142
          }
        },
        applyQuality: this.applyQuality
      }],
      release_date: '2025-03-05'
    }
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 2,
      medium: 4,
      high: 15
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}

export default JuggernautLightningFlux 