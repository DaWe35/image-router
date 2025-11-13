import { PRICING_TYPES } from '../../PricingScheme.js'

class Photon {
  constructor() {
    this.data = {
      id: 'luma/photon',
      providers: [{
        id: 'replicate',
        model_name: 'luma/photon',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.03
        }
      }],
      arena_score: 1035,
      release_date: '2024-12-03'
      
    }
  }

  getData() {
    return this.data
  }
}

export default Photon 