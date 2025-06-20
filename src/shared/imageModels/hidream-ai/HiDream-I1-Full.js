import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcRunware } from '../../../services/imageHelpers.js'

class HiDreamI1Full {
  constructor() {
    this.data = {
      id: 'HiDream-ai/HiDream-I1-Full',
      providers: [{
        id: 'runware',
        model_name: 'runware:97@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcRunware,
          range: {
            min: 0.0045,
            average: 0.009,
            max: 0.015
          }
        },
        applyQuality: this.applyQuality
      }],
      release_date: '2025-04-28',
      examples: [{
        image: '/model-examples/HiDream-I1-Full-2025-06-15T21-31-49-649Z.webp'
      }]
    }
  }

  applyQuality(params) {
    const defaultSteps = 30
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

export default HiDreamI1Full 