import { PRICING_TYPES } from '../../PricingScheme.js'

class Hailuo02Standard {
  constructor() {
    this.data = {
      id: 'minimax/hailuo-02-standard',
      providers: [{
        id: 'wavespeed',
        model_name: 'minimax/hailuo-02/standard',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.25, // price per video in USD
        },
      }],
      release_date: '2025-06-18',
      examples: [
        {
          video: '/model-examples/hailuo-02-standard-2025-06-24T15-24-10-877Z.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Hailuo02Standard 