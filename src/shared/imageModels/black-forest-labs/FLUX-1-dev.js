import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcRunware } from '../../../services/imageHelpers.js'

class Flux1Dev {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1-dev',
      providers: [{
        id: 'runware',
        model_name: 'runware:101@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcRunware,
          range: {
            min: 0.0026,
            average: 0.0038,
            max: 0.0045
          }
        },
        applyQuality: this.applyQuality
      }],
      arena_score: 1046,
      release_date: '2024-08-01',
      examples: [
        {
          image: '/model-examples/FLUX-1-dev.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
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
}

export default Flux1Dev 