import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

class Sd15Dpo {
  constructor() {
    this.data = {
      id: 'stabilityai/sd1.5-dpo',
      providers: [
        {
          id: 'runware',
          model_name: 'civitai:240850@271743',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.0013,
              average: 0.0019,
              max: 0.0038
            }
          },
          applyQuality: this.applyQuality
        }
    ],
      release_date: '2022-10-20'
    }
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 10,
      medium: 20,
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

export default Sd15Dpo