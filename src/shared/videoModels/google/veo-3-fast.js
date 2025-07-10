import { PRICING_TYPES } from '../../PricingScheme.js'

class Veo3Fast {
  constructor() {
    this.data = {
      id: 'google/veo-3-fast',
      providers: [{
        id: 'replicate',
        model_name: 'google/veo-3-fast',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 3.2,
        },
      }, {
        id: 'wavespeed',
        model_name: 'google/veo3-fast', // no audio ?
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 3.2,
        },
      }],
      release_date: '2025-06-12'
    }
  }

  getData() {
    return this.data
  }
}

export default Veo3Fast