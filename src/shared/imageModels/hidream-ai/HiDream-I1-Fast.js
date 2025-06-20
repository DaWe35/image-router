import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcRunware } from '../../../services/imageHelpers.js'

class HiDreamI1Fast {
  constructor() {
    this.data = {
      id: 'HiDream-ai/HiDream-I1-Fast',
      providers: [{
        id: 'runware',
        model_name: 'runware:97@3',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcRunware,
          range: {
            min: 0.0019,
            average: 0.0026,
            max: 0.0038
          }
        },
        applyQuality: this.applyQuality
      }],
      arena_score: 1050,
      release_date: '2025-04-28',
      examples: [{
        image: '/model-examples/HiDream-I1-Fast-2025-06-15T21-29-53-614Z.webp'
      }]
    }
  }

  applyQuality(params) {
    const defaultSteps = 16
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

export default HiDreamI1Fast 