import { PRICING_TYPES } from '../../PricingScheme.js'

class Imagen4 {
  constructor() {
    this.data = {
      id: 'google/imagen-4',
      providers: [{
        id: 'vertex',
        model_name: 'imagen-4.0-generate-001',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.037
        }
      }],
      release_date: '2025-08-14',
      sizes: [
        '1024x1024',
        '896x1280',
        '1280x896',
        '768x1408',
        '1408x768',
        '2048x2048',
        '1792x2560',
        '2560x1792',
        '1536x2816',
        '2816x1536'
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Imagen4