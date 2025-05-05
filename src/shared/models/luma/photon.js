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
      arena_score: 1031,
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