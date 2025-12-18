import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'

export default class {
  constructor() {
    this.data = {
      id: 'prunaai/P-Image-1.0',
      providers: [{
        id: 'runware',
        model_name: 'prunaai:1@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          range: {
            min: 0.0044,
            average: 0.0044,
            max: 0.0088
          },
        },
        applyImage: this.applyImage
      }],
      release_date: '2025-12-01'
    }
  }

  async applyImage(params) {
    // Switch to image-to-image model when input image is present
    params.model = 'prunaai:2@1'
    params.inputs_referenceImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    delete params.files.image
    return params
  }

  getData() {
    return this.data
  }
}

