import { PRICING_TYPES } from '../../PricingScheme.js'

class Imagen4Fast {
  constructor() {
    this.data = {
      id: 'google/imagen-4-fast',
      providers: [{
        id: 'vertex',
        model_name: 'imagen-4.0-fast-generate-001',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.015  // Official $0.02/image, 25% discount
        }
      }],
      release_date: '2025-08-14',
      sizes: [
        '1024x1024',
        '896x1280',
        '1280x896',
        '768x1408',
        '1408x768',
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Imagen4Fast