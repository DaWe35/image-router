import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcRunware } from '../../../services/imageHelpers.js'

class HiDreamI1Dev {
  constructor() {
    this.data = {
      id: 'HiDream-ai/HiDream-I1-Dev',
      providers: [{
        id: 'runware',
        model_name: 'runware:97@2',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcRunware,
          range: {
            min: 0.0019,
            average: 0.0045,
            max: 0.008
          }
        },
        applyQuality: this.applyQuality
      }],
      arena_score: 1082,
      release_date: '2025-03-05',
      examples: [{
        image: '/model-examples/HiDream-I1-Dev-2025-06-15T21-31-50-531Z.webp'
      }]
    }
  }

  applyQuality(params) {
    const defaultSteps = 28
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

export default HiDreamI1Dev 