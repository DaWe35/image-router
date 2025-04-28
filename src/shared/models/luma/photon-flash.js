import { PRICING_TYPES } from '../../PricingScheme.js'

class PhotonFlash {
  constructor() {
    this.data = {
      id: 'luma/photon-flash',
      providers: [{
        id: 'replicate',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.01,
        }
      }],
      arenaScore: 964,
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