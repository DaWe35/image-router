import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { processSingleFile } from '../../../services/imageHelpers.js'
import { calculateRunwareDimensions } from '../../../services/imageHelpers.js'

class Flux1Schnell {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1-schnell',
      providers: [{
        id: 'runware',
        model_name: 'runware:100@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.0006,
            average: 0.0013,
            max: 0.007
          }
        },
        applyQuality: this.applyQuality,
        applyImage: this.applyImage,
        applyMask: this.applyMask
      }],
      release_date: '2024-08-01'
      
    }
  }

  getData() {
    return this.data
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 1,
      medium: 4,
      high: 8
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
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
}

export default Flux1Schnell 