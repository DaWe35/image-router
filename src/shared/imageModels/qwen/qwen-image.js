import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple, processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'

class QwenImage {
  constructor() {
    this.data = {
      id: 'qwen/qwen-image',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:108@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.0058,
              average: 0.007,
              max: 0.0122
            }
          },
          applyQuality: this.applyQualityRunware,
          applyImage: this.applyImageRunware
        }, {
          id: 'fal',
          model_name: 'fal-ai/qwen-image',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.02
          },
          applyQuality: this.applyQualityFal
        }
      ],
      arena_score: 1073,
      release_date: '2025-08-01',
      examples: [
        {
          image: '/model-examples/qwen-image-2025-08-07T13-00-25-337Z.webp'
        }
      ]
    }
  }

  async applyImageRunware(params) {
    params.referenceImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    params.model = 'runware:108@20'
    return params
  }

  applyQualityRunware(params) {
    const qualitySteps = {
      low: 20,
      medium: 25,
      high: 40
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  applyQualityFal(params) {
    const qualitySteps = {
      low: 20,
      medium: 30,
      high: 45
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}

export default QwenImage