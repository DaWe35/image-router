import { PRICING_TYPES } from '../../PricingScheme.js'

export default class {
  constructor() {
    this.data = {
      id: 'Tongyi-MAI/Z-Image-Turbo:free',
      providers: [
        {
          id: 'chutes',
          model_name: 'z-image-turbo',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0
          },
        },
      ],
      release_date: '2025-11-25'
    }
  }

  getData() {
    return this.data
  }
}
