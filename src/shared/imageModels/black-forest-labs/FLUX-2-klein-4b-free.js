import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles } from '../../../services/helpers.js'

export default class {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-2-klein-4b:free',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:400@4',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0
          },
          applyImage: this.applyInputImagesReferences,
          applyQuality: this.applyQuality,
        }
      ],
      release_date: '2026-01-15'
    }
  }

  getData() {
    return this.data
  }

  async applyInputImagesReferences(params) {
  params.inputs_referenceImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
  if (params.inputs_referenceImages.length > 1) {
    throw new Error(`Free model only supports one input image. Please use the paid model 'black-forest-labs/FLUX-2-klein-4b' which can handle up to 4 reference images.`)
  }
  delete params.files.image
  return params
}

  applyQuality(params) {
    if (params.quality === 'high') {
      throw new Error(`Free model only supports 'low', 'medium', and 'auto' quality. Please use the paid model 'black-forest-labs/FLUX-2-klein-4b' for high quality generations.`)
    }
    const qualitySteps = {
      low: 2,
      medium: 4
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }
}
