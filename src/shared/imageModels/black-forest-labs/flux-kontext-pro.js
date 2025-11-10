import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingle, applyReferenceImages1024x1024 } from '../../applyImage.js'

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
          applyImage: applyReferenceImages1024x1024,
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
      arena_score: 1098,
      release_date: '2025-05-29',
      examples: [
        {
          image: '/model-examples/flux-1-kontext-pro-2025-05-30T19-06-27-208Z.webp'
        }
      ],
      sizes: [
        '1568x672',
        '1392x752',
        '1184x880',
        '1248x832',
        '1024x1024',
        '832x1248',
        '880x1184',
        '752x1392',
        '672x1568'
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default FluxKontextPro 