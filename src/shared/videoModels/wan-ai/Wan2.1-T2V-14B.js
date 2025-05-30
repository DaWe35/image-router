import { PRICING_TYPES } from '../../PricingScheme.js'

class Wan21T2V14B {
  constructor() {
    this.data = {
      id: 'Wan-AI/Wan2.1-T2V-14B',
      providers: [{
        id: 'deepinfra',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.4,
        },
      }],
      arena_score: 1027,
      release_date: '2025-02-22',
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

export default Wan21T2V14B 