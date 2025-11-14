import { PRICING_TYPES } from '../../PricingScheme.js'

class Imagen40520 {
  constructor() {
    this.data = {
      id: 'google/imagen-4-05-20',
      providers: [{
        id: 'vertex',
        model_name: 'imagen-4.0-generate-preview-05-20',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.04
        }
      }],
      release_date: '2025-05-20'
    }
  }

  getData() {
    return this.data
  }
}

export default Imagen40520 