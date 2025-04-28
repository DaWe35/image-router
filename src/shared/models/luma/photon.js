import { PRICING_TYPES } from '../../PricingScheme.js'

class Photon {
  constructor() {
    this.data = {
      id: 'luma/photon',
      providers: [{
        id: 'replicate',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.03,
        }
      }],
      arenaScore: 1031,
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