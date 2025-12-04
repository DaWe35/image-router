import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple, processSingleOrMultipleFiles, postCalcNanoGPTDiscounted5 } from '../../../services/imageHelpers.js'
import { applyImageNanoGPT } from '../../applyImage.js'
import { calculateRunwareDimensions } from '../../../services/imageHelpers.js'

export default class SeedreamV4 {
  constructor() {
    this.data = {
      id: 'bytedance/seedream-4.5',
      providers: [
        {
          id: 'runware',
          model_name: 'bytedance:seedream@4.5',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.04,
          },
          applyImage: this.applyImageRunware
        }
      ],
      release_date: '2025-12-03',
      arena_score: 1220,
      sizes: [
        '2048x2048',
        '2304x1728',
        '1728x2304',
        '2560x1440',
        '1440x2560',
        '2496x1664',
        '1664x2496',
        '3024x1296',
        '4096x4096',
        '4608x3456',
        '3456x4608',
        '5120x2880',
        '2880x5120',
        '4992x3328',
        '3328x4992',
        '6048x2592'
      ]
    }
  }

  async applyImageRunware(params) {
    params.referenceImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    delete params.files.image

    if (!params.size || params.size === 'auto') {
      const dimensions = await calculateRunwareDimensions(
        params.referenceImages[0],
        { minPixels: 3686400, maxPixels: 16777216, minDimension: 256, maxDimension: 16383, pixelStep: 1 }
      )
      params.size = `${dimensions.width}x${dimensions.height}`
    }
    
    return params
  }

  getData() {
    return this.data
  }
}
