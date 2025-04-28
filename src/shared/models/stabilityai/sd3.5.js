import { PRICING_TYPES } from '../../PricingScheme.js'

class Sd35 {
  constructor() {
    this.data = {
      id: 'stabilityai/sd3.5',
      providers: [
        {
          id: 'deepinfra',
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
      arenaScore: 1027,
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