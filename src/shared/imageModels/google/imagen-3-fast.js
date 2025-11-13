import { PRICING_TYPES } from '../../PricingScheme.js'

class Imagen3Fast {
  constructor() {
    this.data = {
      id: 'google/imagen-3-fast',
      providers: [{
        id: 'vertex',
        model_name: 'imagen-3.0-fast-generate-001',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.02
        }
      }],
      release_date: '2024-12-16',
      ,
      sizes: [
        '1024x1024',
        '896x1280',
        '1280x896',
        '768x1408',
        '1408x768'
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Imagen3Fast 