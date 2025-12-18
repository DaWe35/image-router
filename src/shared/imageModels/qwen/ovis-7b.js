import { PRICING_TYPES } from '../../PricingScheme.js'

export default class {
  constructor() {
    this.data = {
      id: 'AIDC-AI/Ovis-Image-7B',
      providers: [
        {
          id: 'fal',
          model_name: 'fal-ai/ovis-image',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.012
          },
          applyQuality: this.applyQualityFal
        }
      ],
      release_date: '2025-11-28'
      
    }
  }

  applyQualityFal(params) {
    const qualitySteps = {
      low: 20,
      medium: 28,
      high: 45
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}
