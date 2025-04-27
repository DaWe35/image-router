import { PRICING_TYPES } from '../../PricingScheme.js'

class SdxlTurbo {
  constructor() {
    this.data = {
      id: 'stabilityai/sdxl-turbo',
      providers: [
        {
          name: 'deepinfra',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.0002,
          }
        },
        /* {
          name: 'replicate',
          providerModelId: 'stability-ai/stable-diffusion-3.5-large-turbo',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.04,
          }
        } */
    ],
      arenaScore: 1030,
      examples: [
        {
          image: '/model-examples/sdxl-turbo.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default SdxlTurbo 