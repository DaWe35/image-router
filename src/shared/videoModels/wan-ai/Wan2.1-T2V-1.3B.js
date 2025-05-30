import { PRICING_TYPES } from '../../PricingScheme.js'

class Wan21T2V1B {
  constructor() {
    this.data = {
      id: 'Wan-AI/Wan2.1-T2V-1.3B',
      providers: [{
        id: 'deepinfra',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.1,
        },
      }],
      arena_score: null,
      release_date: '2025-02-25',
      examples: [
        {
          video: ''
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Wan21T2V1B 