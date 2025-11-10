import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingle, applyImagesReferences1024x1024 } from '../../applyImage.js'

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
          applyImage: applyImagesReferences1024x1024,
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
      arena_score: 1128,
      release_date: '2025-05-29',
      examples: [
        {
          image: '/model-examples/flux-1-kontext-max.webp'
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

export default FluxKontextMax 