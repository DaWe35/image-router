import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class Photon {
  constructor() {
    this.data = {
      id: 'luma/photon',
      providers: [{
        id: 'replicate',
        model_name: 'luma/photon',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.03,
        }
      }],
      size: {
        type: SIZE_TYPES.RANGE,
        min: "256x256",
        max: "1536x1536",
        default: "1024x1024"
      },
      arena_score: 1035,
      release_date: '2024-12-03',
      examples: [
        {
          image: '/model-examples/photon-2025-04-03T15-07-51-501Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Photon 