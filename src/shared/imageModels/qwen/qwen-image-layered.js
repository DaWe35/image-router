import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple, processSingleFile } from '../../../services/helpers.js'
import { applyInputImagesReferences } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'qwen/qwen-image-layered',
      providers: [
        {
          id: 'runware',
          model_name: 'alibaba:qwen-image@layered',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.01,
              average: 0.0211,
              max: 0.0211
            }
          },
          applyQuality: this.applyQualityRunware,
          applyImage: applyInputImagesReferences,
        }
      ],
      release_date: '2025-11-19'
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

  async applyImage(params) {
    return params
  }

  async applyMask(params) {
    params.maskImage = await processSingleFile(params.files.mask, 'datauri')
    delete params.files.mask
    return params
  }

  getData() {
    return this.data
  }
}
