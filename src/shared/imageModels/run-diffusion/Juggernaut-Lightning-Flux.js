import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcRunware } from '../../../services/imageHelpers.js'

class JuggernautLightningFlux {
  constructor() {
    this.data = {
      id: 'run-diffusion/Juggernaut-Lightning-Flux',
      providers: [{
        id: 'runware',
        model_name: 'rundiffusion:110@101',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcRunware,
          range: {
            min: 0.0008,
            average: 0.0017,
            max: 0.0034
          }
        },
        applyQuality: this.applyQuality
      }, {
        id: 'deepinfra',
        model_name: 'run-diffusion/Juggernaut-Lightning-Flux',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.009,
        }
      }],
      release_date: '2025-03-05',
      examples: [
        {
          image: '/model-examples/Juggernaut-Lightning-Flux-2025-04-03T14-15-05-487Z.webp'
        }
      ]
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