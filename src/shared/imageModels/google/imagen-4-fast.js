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
          value: 0.02,
        }
      }],
      release_date: '2025-08-14',
      arena_score: 1079,
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