import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingle, applyReferenceImages } from '../../applyImage.js'

class FluxKontextPro {
  constructor() {
    this.data = {
      id: 'black-forest-labs/flux-kontext-pro',
      providers: [
        {
          id: 'runware',
          model_name: 'bfl:3@1',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.04,
          },
          applyImage: applyReferenceImages,
        }, {
          id: 'replicate',
          model_name: 'black-forest-labs/flux-kontext-pro',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.04,
          },
          applyImage: applyImageSingle,
        }
    ],
      arena_score: 1076,
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
}

export default FluxKontextPro 