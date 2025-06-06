import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'
import FluxKontextPro from './flux-kontext-pro.js'
const fluxKontextProInstance = new FluxKontextPro()

class FluxKontextMax {
  constructor() {
    this.data = {
      id: 'black-forest-labs/flux-kontext-max',
      providers: [{
        id: 'replicate',
        model_name: 'black-forest-labs/flux-kontext-max',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.08,
        },
        applyImage: fluxKontextProInstance.applyImage,
      }],
      size: {
        type: SIZE_TYPES.RANGE,
        min: "256x256",
        max: "1440x1440",
        default: "1024x1024"
      },
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