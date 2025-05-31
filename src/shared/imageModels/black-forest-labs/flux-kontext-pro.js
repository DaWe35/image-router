import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, mergeImages } from '../../../services/imageHelpers.js'

class FluxKontextPro {
  constructor() {
    this.data = {
      id: 'black-forest-labs/flux-kontext-pro',
      providers: [{
        id: 'replicate',
        model_name: 'black-forest-labs/flux-kontext-pro',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.04,
        },
        applyImage: this.applyImage,
      }],
      arena_score: 1083,
      release_date: '2025-05-29',
      examples: [
        {
          image: '/model-examples/flux-1-kontext-pro-2025-05-30T19-06-27-208Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  async applyImage(params) {
    // Since Flux only accepts 1 input image, merge multiple images if provided
    if (params.files.image.length > 1) {
      params.prompt = 'system: merge all images into a single picture seamlessly\n\nuser: ' + params.prompt
    }
    params.image = await mergeImages(params.files.image)
    delete params.files.image
    return params
  }
}

export default FluxKontextPro 