import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple, processSingleFile } from '../../../services/helpers.js'

export default class {
  constructor() {
    this.data = {
      id: 'lightricks/ltx-2',
      providers: [
        {
          id: 'runware',
          model_name: 'lightricks:ltx@2',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.03,
              average: 0.15,
              max: 0.86,
            },
          },
          applyImage: this.applyInputsFrameimagesImageRunware,
          applyQuality: this.applyQualityRunwareLTX2,
        }
      ],
      release_date: '2026-01-05',
      sizes: [
        '1024x1024',
        '1408x768',
        '896x1280',
        '1280x896',
        '768x1408',
      ],
      seconds: [1, 1.2, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      default_seconds: 5
    }
  }

  getData() {
    return this.data
  }

  async applyInputsFrameimagesImageRunware(params) {
    params.inputs_frameImages_image = await processSingleFile(params.files.image, 'datauri')
    delete params.files.image
    return params
  }

  applyQualityRunwareLTX2(params) {
    const qualitySteps = {
      low: 20,
      medium: 40,
      high: 60,
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }
}
