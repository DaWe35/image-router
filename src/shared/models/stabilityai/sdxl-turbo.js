import { PRICING_TYPES } from '../../PricingScheme.js'

class SdxlTurbo {
  constructor() {
    this.data = {
      id: 'stabilityai/sdxl-turbo',
      providers: [
        {
          id: 'deepinfra',
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
      arena_score: 1030,
      release_date: '2024-10-22',
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