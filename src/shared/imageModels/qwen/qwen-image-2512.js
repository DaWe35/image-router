import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple, processSingleFile } from '../../../services/helpers.js'
import { calculateRunwareDimensions } from '../../../services/helpers.js'

export default class {
  constructor() {
    this.data = {
      id: 'qwen/qwen-image-2512',
      providers: [
        {
          id: 'runware',
          model_name: 'alibaba:qwen-image@2512',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.0052,
              average: 0.0064,
              max: 0.0103
            }
          },
          applyQuality: this.applyQualityRunware,
          applyImage: this.applyImage,
          applyMask: this.applyMask
        }
      ],
      release_date: '2025-12-25'
    }
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

  async applyImage(params) {
    params.seedImage = await processSingleFile(params.files.image, 'datauri')
    //params.strength = 0.8
    delete params.files.image

    if (!params.size || params.size === 'auto') {
      const dimensions = await calculateRunwareDimensions(
        params.seedImage,
        { minPixels: undefined, maxPixels: undefined, minDimension: 128, maxDimension: 2048, pixelStep: 8 }
      )
      params.size = `${dimensions.width}x${dimensions.height}`
    }
    
    return params
  }

  async applyMask(params) {
    params.maskImage = await processSingleFile(params.files.mask, 'datauri')
    delete params.files.mask
    return params
  }

  getData() {
    return this.data
  }
}
