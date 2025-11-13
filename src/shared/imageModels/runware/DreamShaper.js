import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

class DreamShaper {
  constructor() {
    this.data = {
      id: 'Lykon/DreamShaper',
      providers: [{
        id: 'runware',
        model_name: 'civitai:4384@128713',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.0013,
            average: 0.0019,
            max: 0.0294
          }
        },
        applyQuality: this.applyQuality
      }],
      release_date: '2023-07-29'
    }
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 15,
      medium: 25,
      high: 50
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}

export default DreamShaper 