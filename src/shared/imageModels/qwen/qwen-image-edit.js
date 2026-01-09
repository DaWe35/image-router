import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple, processSingleOrMultipleFiles } from '../../../services/helpers.js'
import { applyReferenceImages } from '../../applyImage.js'
import { calculateRunwareDimensions } from '../../../services/helpers.js'

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
          applyImage: this.applyImageQwenImageEdit
        }
      ],
      release_date: '2025-08-18'
    }
  }

  async applyImageQwenImageEdit(params) {
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