import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

class RealVisXL {
  constructor() {
    this.data = {
      id: 'SG161222/RealVisXL',
      providers: [{
        id: 'runware',
        model_name: 'civitai:139562@361593',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.0013,
            average: 0.0019,
            max: 0.009
          }
        },
        applyQuality: this.applyQuality
      }],
      release_date: '2025-02-26',
      examples: [{
        image: '/model-examples/RealVisXL-2025-06-15T21-45-25-442Z.webp'
      }]
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

export default RealVisXL 