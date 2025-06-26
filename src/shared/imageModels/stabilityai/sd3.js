import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcRunware } from '../../../services/imageHelpers.js'
import { processSingleFile } from '../../../services/imageHelpers.js'

class Sd3 {
  constructor() {
    this.data = {
      id: 'stabilityai/sd3',
      providers: [{
        id: 'runware',
        model_name: 'runware:5@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcRunware,
          range: {
            min: 0.0006,
            average: 0.0019,
            max: 0.0064
          }
        },
        applyImage: this.applyImage,
        applyMask: this.applyMask,
        applyQuality: this.applyQuality
      }],
      arena_score: 1015,
      release_date: '2024-06-12',
      examples: [
        {
          image: '/model-examples/sd3-2025-06-15T13-09-47-800Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  async applyImage(params) {
    params.seedImage = await processSingleFile(params.files.image, 'datauri')
    delete params.files.image
    return params
  }

  async applyMask(params) {
    params.maskImage = await processSingleFile(params.files.mask, 'datauri')
    delete params.files.mask
    return params
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 15,
      medium: 28,
      high: 45
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }
}

export default Sd3