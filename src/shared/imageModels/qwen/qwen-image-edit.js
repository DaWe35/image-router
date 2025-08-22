import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple, processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'

class QwenImageEdit {
  constructor() {
    this.data = {
      id: 'qwen/qwen-image-edit',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:108@20',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.0032,
              average: 0.0058,
              max: 0.0096
            }
          },
          applyQuality: this.applyQualityRunware,
          applyImage: this.applyImageRunware
        }
      ],
      arena_score: 1099,
      release_date: '2025-08-18'

    }
  }

  async applyImageRunware(params) {
    params.referenceImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    params.model = 'runware:108@20'
    return params
  }

  applyQualityRunware(params) {
    const qualitySteps = {
      low: 8,
      medium: 15,
      high: 30
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}

export default QwenImageEdit