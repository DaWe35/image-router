import { PRICING_TYPES } from '../../PricingScheme.js'

class QwenImage {
  constructor() {
    this.data = {
      id: 'qwen/qwen-image',
      providers: [{
        id: 'fal',
        model_name: 'fal-ai/qwen-image',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.02
        },
        applyQuality: this.applyQuality
      }],
      release_date: '2025-08-01',
      examples: [
        {
          image: '/model-examples/qwen-image-2025-08-07T13-00-25-337Z.webp'
        }
      ]
    }
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 20,
      medium: 30,
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

export default QwenImage