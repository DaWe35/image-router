import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles, processSingleFile, postCalcNanoGPTDiscounted5 } from '../../../services/helpers.js'

export default class {
  constructor() {
    this.data = {
      id: 'reve/reve-1',
      providers: [
        {
          id: 'replicate',
          model_name: 'reve/create',
          pricing: {
            type: PRICING_TYPES.CALCULATED,
            calcFunction: this.calcRevePrice,
            range: {
              min: 0.025,
              average: 0.025,
              max: 0.04,
            },
          },
          applyImage: this.applyImageReplicate,
          applyQuality: this.applyQualityReplicate,
        }
      ],
      /* release_date: '2025-08-05', */
    }
  }

  calcRevePrice(params) {
    if (!params.files.image) { // create
      return 0.025
    } else if (params.files.image && params.files.image.length === 1) { // edit
      if (params.quality === 'low') {
        return 0.01
      } else {
        return 0.04
      }
    } else if (params.files.image && params.files.image.length > 1) { // remix
      return 0.04
    } else {
      throw new Error('Invalid image input')
    }
  }

  async applyImageReplicate(params) {
    const images = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    if (Array.isArray(images) && images.length > 1) {
      params.model = 'reve/remix'
      params.reference_images = images
    } else if (Array.isArray(images) && images.length === 1) {
      params.model = 'reve/edit'
      params.image = images[0]
    } else {
      throw new Error('Invalid image input')
    }
    delete params.files.image
    return params
  }

  applyQualityReplicate(params) {
    if (params.model === 'reve/edit' && params.quality === 'low') {
      params.model = 'reve/edit-fast'
    }
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}
