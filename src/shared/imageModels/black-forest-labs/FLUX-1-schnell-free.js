import { PRICING_TYPES } from '../../PricingScheme.js'

class Flux1SchnellFree {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1-schnell:free',
      providers: [
        {
          id: 'together',
          model_name: 'black-forest-labs/FLUX.1-schnell-Free',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0
          },
          applyQuality: this.applyTogetherQuality
        }, {
          id: 'deepinfra',
          model_name: 'black-forest-labs/FLUX-1-schnell',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0
          },
          applyQuality: this.applyQuality
        }
      ],
      arena_score: 1000,
      release_date: '2024-08-01'
      
    }
  }

  applyQuality(params) {
    if (params.quality === 'high' || params.quality === 'medium') {
      throw new Error(`Free model only supports 'low' quality. Please use the paid model 'black-forest-labs/FLUX-1-schnell' for higher quality.`)
    }
    params.num_inference_steps = 1 // 1 for free model
    delete params.quality
    return params
  }

  applyTogetherQuality(params) {
    if (params.quality === 'high') {
    throw new Error(`This free model only supports 'low' and 'medium' quality. Please use the paid model 'black-forest-labs/FLUX-1-schnell' for higher quality.`)
  }
    const qualitySteps = {
      low: 1,
      medium: 4,
      high: 8
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}

export default Flux1SchnellFree 