import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'
import { processSingleFile } from '../../../services/imageHelpers.js'

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
      size: {
        type: SIZE_TYPES.RANGE,
        min: "256x256",
        max: "1440x1440",
        default: "1024x1024"
      },
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
    params.image = await processSingleFile(params.files.image)
    delete params.files.image
    return params
  }
}

export default FluxKontextPro 