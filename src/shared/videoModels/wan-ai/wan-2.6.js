import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple, processSingleFile } from '../../../services/imageHelpers.js'

export default class {
  constructor() {
    this.data = {
      id: 'wan/wan-2.6',
      providers: [
        {
          id: 'runware',
          model_name: 'alibaba:wan@2.6',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.5,
              average: 0.75,
              max: 2.25
            }
          },
          applyImage: this.applyInputsFrameimagesImageRunware,
        }
      ],
      release_date: '2025-12-16',
      seconds: [5, 10, 15],
      default_seconds: 5,
      sizes: [
        '960x960',
        '1088x832',
        '832x1088',
        '1440x1440',
        '1632x1248',
        '1248x1632',
        '1280x720',
        '720x1280',
        '1920x1080',
        '1080x1920',
      ]
    }
  }

  async applyInputsFrameimagesImageRunware(params) {
    params.inputs_frameImages_image = await processSingleFile(params.files.image, 'datauri')
    delete params.files.image
    return params
}

  getData() {
    return this.data
  }
}
