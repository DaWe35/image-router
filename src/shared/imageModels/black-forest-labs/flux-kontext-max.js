import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingle, applyReferenceImages1024x1024 } from '../../applyImage.js'

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
          applyImage: applyReferenceImages1024x1024,
        }, /* {
          id: 'replicate',
          model_name: 'black-forest-labs/flux-kontext-max',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.08,
          },
          applyImage: applyImageSingle, // applyImage broken, needs to be fixed
        } */
      ],
      release_date: '2025-05-29',
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