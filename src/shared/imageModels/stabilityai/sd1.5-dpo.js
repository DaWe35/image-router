import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcRunware } from '../../../services/imageHelpers.js'

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
            postCalcFunction: postCalcRunware,
            range: {
              min: 0.0013,
              average: 0.0019,
              max: 0.0038
            }
          },
          applyQuality: this.applyQuality
        }
    ],
      arena_score: null,
      release_date: '2022-10-20',
      examples: [
        {
          image: '/model-examples/sd1.5-dpo-2025-06-15T16-14-50-412Z.webp'
        }
      ]
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