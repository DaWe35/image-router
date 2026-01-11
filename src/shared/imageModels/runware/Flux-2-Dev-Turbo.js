import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple, processSingleFile, processSingleOrMultipleFiles, calculateRunwareDimensions, extractWidthHeight } from '../../../services/helpers.js'

export default class {
  constructor() {
    this.data = {
      id: 'fal/flux-2-dev-turbo',
      providers: [
        {
          id: 'fal',
          model_name: 'fal-ai/flux-2/turbo',
          pricing: {
            type: PRICING_TYPES.CALCULATED,
            calcFunction: this.calculatePriceFal,
            range: {
              min: 0.008,
              average: 0.008,
              max: 0.024
            }
          },
          applyImage: this.applyImageFal,
        },
        /* {
          id: 'runware',
          model_name: 'imagerouter:2@1',
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
        }, */
      ],
      release_date: '2025-12-29'
    }
  }

  calculatePriceFal(params) {
    const hasInput = !!(params.files?.image || params.image_url)
    const inputMP = hasInput ? 1 : 0
    
    let { width, height } = extractWidthHeight(params.size)
    if (!width || !height) {
      width = 1024
      height = 1024
    }
    
    const outputMP = (width * height) / 1000000
    return (inputMP + outputMP) * 0.008
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 4,
      medium: 8,
      high: 16
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

  async applyImageFal(params) {
    params.image_urls = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    params.model = params.model.replace('/turbo', '/turbo/edit')
    delete params.files.image
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
