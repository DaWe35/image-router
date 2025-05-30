import { PRICING_TYPES } from '../../PricingScheme.js'
import FluxKontextPro from './flux-kontext-pro.js'
const fluxKontextProInstance = new FluxKontextPro()

class FluxKontextMax {
  constructor() {
    this.data = {
      id: 'black-forest-labs/flux-kontext-max',
      providers: [{
        id: 'replicate',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.08,
        },
        applyImage: fluxKontextProInstance.applyImage,
      }],
      arena_score: 1087,
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