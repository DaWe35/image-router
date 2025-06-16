import { PRICING_TYPES } from '../../PricingScheme.js'

class Imagen40606 {
  constructor() {
    this.data = {
      id: 'google/imagen-4-06-06',
      providers: [{
        id: 'vertex',
        model_name: 'imagen-4.0-generate-preview-06-06',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.04,
        }
      }],
      release_date: '2025-06-06',
    }
  }

  getData() {
    return this.data
  }
}

export default Imagen40606 