import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

class SdxlTurbo {
  constructor() {
    this.data = {
      id: 'stabilityai/sdxl-turbo',
      providers: [
        {
          id: 'deepinfra',
          model_name: 'stabilityai/sdxl-turbo',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.0002
          },
          applyQuality: this.applyQuality
        }, {
          id: 'runware',
          model_name: 'civitai:215418@273102',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.0006
          }
        },
        /* {
          name: 'replicate',
          providerModelId: 'stability-ai/stable-diffusion-3.5-large-turbo',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.04
          }
        } */
    ],
      arena_score: 1031,
      release_date: '2024-10-22'
    }
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 2,
      medium: 5,
      high: 10
    }
    params.num_inference_steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}

export default SdxlTurbo 