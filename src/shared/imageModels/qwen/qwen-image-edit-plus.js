import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple, processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'
import { calculateRunwareDimensions } from '../../../services/imageHelpers.js'

class QwenImageEditPlus {
  constructor() {
    this.data = {
      id: 'qwen/qwen-image-edit-plus',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:108@22',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.0083
          },
          applyImage: this.applyImageQwenImageEditPlus
        }
      ],
      release_date: '2025-08-18'
    }
  }
  
  async applyImageQwenImageEditPlus(params) {
    params.referenceImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    if (!params.size || params.size === 'auto') {
      const dimensions = await calculateRunwareDimensions(
        params.referenceImages[0],
        { minPixels: undefined, maxPixels: undefined, minDimension: 512, maxDimension: 2048, pixelStep: 16 }
      )
      params.size = `${dimensions.width}x${dimensions.height}`
    }
    
    delete params.files.image
    return params
  }

  getData() {
    return this.data
  }
}

export default QwenImageEditPlus