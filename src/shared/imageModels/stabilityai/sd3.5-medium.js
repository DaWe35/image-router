import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

class Sd35Medium {
  constructor() {
    this.data = {
      id: 'stabilityai/sd3.5-medium',
      providers: [{
        id: 'deepinfra',
        model_name: 'stabilityai/sd3.5-medium',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          value: 0.03,
        },
        applyQuality: this.applyQuality
      }],
      arena_score: 928,
      release_date: '2024-10-22',
      examples: [
        {
          image: '/model-examples/sd3.5-medium.webp'
        }
      ]
    }
  }
  
  applyQuality(params) {
    const qualitySteps = {
      low: 25,
      medium: 35,
      high: 50
    }
    params.num_inference_steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}

export default Sd35Medium 