import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'

class CyberRealisticPony {
  constructor() {
    this.data = {
      id: 'cyberdelia/CyberRealisticPony',
      providers: [{
        id: 'runware',
        model_name: 'imagerouter:443821@2581228',
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
      release_date: '2026-01-24'
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