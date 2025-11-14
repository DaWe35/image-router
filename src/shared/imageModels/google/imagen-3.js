import { PRICING_TYPES } from '../../PricingScheme.js'

class Imagen3 {
  constructor() {
    this.data = {
      id: 'google/imagen-3',
      providers: [
        {
          id: 'geminiImagen',
          model_name: 'imagen-3.0-generate-002',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.03
          }
        }, {
          id: 'vertex',
          model_name: 'imagen-3.0-generate-002',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.04
          }
        }
      ],
      arena_score: 1092,
      release_date: '2024-12-16',
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

export default Imagen3 