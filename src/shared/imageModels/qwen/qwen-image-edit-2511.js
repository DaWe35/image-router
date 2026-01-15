import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'
import { applyInputImagesReferences } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'qwen/qwen-image-edit-2511',
      providers: [
        {
          id: 'runware',
          model_name: 'alibaba:qwen-image-edit@2511',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.0122,
              average: 0.0186,
              max: 0.03
            }
          },
          applyQuality: this.applyQualityRunware,
          applyImage: applyInputImagesReferences,
        }
      ],
      release_date: '2025-11-25'
    }
  }

  applyQualityRunware(params) {
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
