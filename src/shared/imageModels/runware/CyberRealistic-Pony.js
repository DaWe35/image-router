import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

class CyberRealisticPony {
  constructor() {
    this.data = {
      id: 'cyberdelia/CyberRealisticPony',
      providers: [{
        id: 'runware',
        model_name: 'pasaranax:443821@1957537',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.0013,
            average: 0.0019,
            max: 0.007
          }
        },
        applyQuality: this.applyQuality
      }],
      release_date: '2025-06-29',
      examples: [
        {
          image: '/model-examples/pasaranax:443821@1957537.webp'
        }
      ]
    }
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 10,
      medium: 20,
      high: 35
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}

export default CyberRealisticPony 