import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcRunware } from '../../../services/imageHelpers.js'

class JuggernautXL {
  constructor() {
    this.data = {
      id: 'run-diffusion/Juggernaut-XL',
      providers: [{
        id: 'runware',
        model_name: 'civitai:133005@782002',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcRunware,
          range: {
            min: 0.0025,
            average: 0.005,
            max: 0.0095
          }
        },
        applyQuality: this.applyQuality
      }],
      arena_score: null,
      release_date: '2024-08-29',
      examples: []
    }
  }

  applyQuality(params) {
    const defaultSteps = 20
    const qualitySteps = {
      low: Math.round(defaultSteps / 2),
      medium: defaultSteps,
      high: Math.round(defaultSteps * 1.5)
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}

export default JuggernautXL 