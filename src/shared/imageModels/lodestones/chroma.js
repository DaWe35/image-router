import { PRICING_TYPES } from '../../PricingScheme.js'

class Chroma {
  constructor() {
    this.data = {
      id: 'lodestones/Chroma',
      providers: [{
        id: 'chutes',
        model_name: 'chroma',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.01
        }
      }],
      release_date: '2025-06-09'
      
    }
  }

  getData() {
    return this.data
  }
}

export default Chroma