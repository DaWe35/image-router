import { PRICING_TYPES } from '../../PricingScheme.js'

class Sd35 {
  constructor() {
    this.data = {
      id: 'stabilityai/sd3.5',
      providers: [
        {
          id: 'deepinfra',
          model_name: 'stabilityai/sd3.5',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.06,
          }
        },
        /* {
          name: 'replicate',
          providerModelId: 'stability-ai/stable-diffusion-3.5-large',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.065,
          }
        } */
    ],
      arena_score: 1028,
      release_date: '2024-10-22',
      examples: [
        {
          image: '/model-examples/sd3.5.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Sd35 