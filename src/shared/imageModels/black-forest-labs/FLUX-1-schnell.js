import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

class Flux1Schnell {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1-schnell',
      providers: [
        {
          id: 'cloudflare',
          model_name: '@cf/black-forest-labs/flux-1-schnell',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.0002,
              average: 0.0007,
              max: 0.0011
            }
          },
          applyQuality: this.applyQuality
        },
        {
          id: 'runware',
          model_name: 'runware:100@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.0006,
              average: 0.0013,
              max: 0.007
            }
          },
          applyQuality: this.applyQuality
        },
      ],
      arena_score: 1000,
      release_date: '2024-08-01'
      
    }
  }

  getData() {
    return this.data
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 1,
      medium: 4,
      high: 8
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }
}

export default Flux1Schnell 