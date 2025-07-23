import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

class RunDiffusionPhotoFlux {
  constructor() {
    this.data = {
      id: 'run-diffusion/RunDiffusion-Photo-Flux',
      providers: [{
        id: 'runware',
        model_name: 'rundiffusion:500@100',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.0025,
            average: 0.005,
            max: 0.0095
          }
        },
        applyQuality: this.applyQuality
      }],
      release_date: '2025-03-05',
    }
  }

  applyQuality(params) {
    const defaultSteps = 25
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

export default RunDiffusionPhotoFlux 