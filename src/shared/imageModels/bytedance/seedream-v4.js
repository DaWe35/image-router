import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple, processSingleOrMultipleFiles, postCalcNanoGPTDiscounted5 } from '../../../services/imageHelpers.js'
import { applyImageNanoGPT } from '../../applyImage.js'

export default class SeedreamV4 {
  constructor() {
    this.data = {
      id: 'bytedance/seedream-4',
      providers: [
        {
          id: 'nanogpt',
          model_name: 'seedream-v4',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcNanoGPTDiscounted5,
            value: 0.03,
          },
          applyImage: applyImageNanoGPT,
        }, {
          id: 'runware',
          model_name: 'bytedance:5@0',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.03,
          },
          applyImage: this.applyImageRunware
        }
      ],
      release_date: '2025-09-09',
      arena_score: 1162,
      examples: [
        {
          image: '/model-examples/seedream-4-2025-09-10T09-26-01-864Z.webp'
        }
      ]
    }
  }

  async applyImageRunware(params) {
    params.referenceImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    return params
  }

  getData() {
    return this.data
  }
}
