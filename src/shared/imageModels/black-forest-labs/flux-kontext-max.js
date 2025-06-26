import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingle, applyReferenceImages } from '../../applyImage.js'

class FluxKontextMax {
  constructor() {
    this.data = {
      id: 'black-forest-labs/flux-kontext-max',
      providers: [
        {
          id: 'runware',
          model_name: 'bfl:4@1',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.08,
          },
          applyImage: applyReferenceImages,
        }, {
          id: 'replicate',
          model_name: 'black-forest-labs/flux-kontext-max',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.08,
          },
          applyImage: applyImageSingle,
        }
      ],
      arena_score: 1103,
      release_date: '2025-05-29',
      examples: [
        {
          image: '/model-examples/flux-1-kontext-max.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default FluxKontextMax 