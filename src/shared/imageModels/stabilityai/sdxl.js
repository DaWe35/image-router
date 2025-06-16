import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcRunware } from '../../../services/imageHelpers.js'

class Sdxl {
  constructor() {
    this.data = {
      id: 'stabilityai/sdxl',
      providers: [
        {
          id: 'runware',
          model_name: 'civitai:101055@128078',
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
      release_date: '2023-07-25',
      examples: [
        {
          image: '/model-examples/sdxl-2025-06-15T16-05-42-225Z.webp'
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

export default Sdxl