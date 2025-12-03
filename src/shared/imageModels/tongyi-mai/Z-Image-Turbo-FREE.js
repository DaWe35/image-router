import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

export default class ZImageTurboFree {
  constructor() {
    this.data = {
      id: 'Tongyi-MAI/Z-Image-Turbo:free',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:z-image@turbo',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0
          },
          applyQuality: this.applyQualityRunware
        },
      ],
      release_date: '2025-11-25'
    }
  }

  applyQualityRunware(params) {
    const qualitySteps = {
      low: 4,
      medium: 8
    }
    if (params.quality === 'high') {
      throw new Error(`Free models only supports 'medium' and 'low' quality. Please use the paid model 'Tongyi-MAI/Z-Image-Turbo' for higher quality.`)
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}
