import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { processSingleFile } from '../../../services/imageHelpers.js'
import { calculateRunwareDimensions } from '../../../services/imageHelpers.js'

export default class IllustriousXL {
  constructor() {
    this.data = {
      id: 'onomaai/illustrious-xl',
      providers: [{
        id: 'runware',
        model_name: 'x:42@889818',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.0013,
            average: 0.0019,
            max: 0.009
          }
        },
        applyImage: this.applyImage,
        applyMask: this.applyMask,
        applyQuality: this.applyQuality
      }],
      release_date: '2024-09-25'
    }
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 15,
      medium: 25,
      high: 50
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  async applyImage(params) {
    params.seedImage = await processSingleFile(params.files.image, 'datauri')
    delete params.files.image

    if (!params.size || params.size === 'auto') {
      const dimensions = await calculateRunwareDimensions(
        params.seedImage,
        { minPixels: undefined, maxPixels: undefined, minDimension: 128, maxDimension: 2048, pixelStep: 64 }
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
