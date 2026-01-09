import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple, processSingleOrMultipleFiles } from '../../../services/helpers.js'
import { calculateRunwareDimensions } from '../../../services/helpers.js'

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
          applyImage: this.applyImageQwenImageEdit
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
      release_date: '2025-08-01'
    }
  }

  async applyImageQwenImageEdit(params) {
    params.model = 'runware:108@20'
    params.referenceImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    if (!params.size || params.size === 'auto') {
      const dimensions = await calculateRunwareDimensions(
        params.referenceImages[0],
        { minPixels: 1024, maxPixels: 1048576, minDimension: 128, maxDimension: 2048, pixelStep: 32 }
      )
      params.size = `${dimensions.width}x${dimensions.height}`
    }
    delete params.files.image
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