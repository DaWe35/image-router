import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { processSingleFile } from '../../../services/imageHelpers.js'
import { calculateRunwareDimensions } from '../../../services/imageHelpers.js'

class Sd3 {
  constructor() {
    this.data = {
      id: 'stabilityai/sd3',
      providers: [{
        id: 'runware',
        model_name: 'runware:5@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
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
      release_date: '2024-06-12'
    }
  }

  getData() {
    return this.data
  }

  async applyImage(params) {
    params.seedImage = await processSingleFile(params.files.image, 'datauri')
    params.strength = 0.8
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