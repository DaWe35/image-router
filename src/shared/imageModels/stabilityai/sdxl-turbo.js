import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcRunware } from '../../../services/imageHelpers.js'

class SdxlTurbo {
  constructor() {
    this.data = {
      id: 'stabilityai/sdxl-turbo',
      providers: [
        {
          id: 'deepinfra',
          model_name: 'stabilityai/sdxl-turbo',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.0002,
          }
        }, {
          id: 'runware',
          model_name: 'civitai:215418@273102',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcRunware,
            value: 0.0006,
          },
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
      arena_score: 1031,
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