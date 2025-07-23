import { PRICING_TYPES } from '../../PricingScheme.js'

class SdxlTurboFree {
  constructor() {
    this.data = {
      id: 'stabilityai/sdxl-turbo:free',
      providers: [
        {
          id: 'deepinfra',
          model_name: 'stabilityai/sdxl-turbo',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0,
          },
          applyQuality: this.applyQuality
        }, {
          id: 'runware',
          model_name: 'civitai:215418@273102',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0,
          },
        }
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

  applyQuality(params) {
    if (params.quality === 'high') {
      throw new Error(`Free model only supports 'medium' and 'low' quality. Please use the paid model 'stabilityai/sdxl-turbo' for higher quality.`)
    }
    const qualitySteps = {
      low: 2,
      medium: 5,
    }
    params.num_inference_steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}

export default SdxlTurboFree 