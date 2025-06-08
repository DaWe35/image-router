import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class PhotonFlash {
  constructor() {
    this.data = {
      id: 'luma/photon-flash',
      providers: [{
        id: 'replicate',
        model_name: 'luma/photon-flash',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.01,
        }
      }],
      size: {
        type: SIZE_TYPES.RANGE,
        min: "256x256",
        max: "1536x1536",
        default: "1024x1024"
      },
      arena_score: 964,
      release_date: '2024-12-03',
      examples: [
        {
          image: '/model-examples/photon-flash-2025-04-03T14-22-54-572Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default PhotonFlash 