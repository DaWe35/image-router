import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple, processSingleOrMultipleFiles, postCalcNanoGPTDiscounted5 } from '../../../services/imageHelpers.js'
import { applyImageNanoGPT } from '../../applyImage.js'

class SeedreamV3 {
  constructor() {
    this.data = {
      id: 'bytedance/seedream-3',
      providers: [
        {
          id: 'nanogpt',
          model_name: 'seedream-v3',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcNanoGPTDiscounted5,
            value: 0.03,
          },
          applyImage: applyImageNanoGPT,
        }, {
          id: 'runware',
          model_name: 'bytedance:3@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.03,
          },
          applyImage: this.applyImageRunware
        }, {
          id: 'fal',
          model_name: 'fal-ai/bytedance/seedream/v3/text-to-image',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.03,
          },
          applyImage: this.applyImageFal
        }
      ],
      release_date: '2025-04-16',
      arena_score: 1160,
      examples: [
        {
          image: '/model-examples/seedream-3-2025-06-16T17-59-52-679Z.webp'
        }
      ]
    }
  }

  async applyImageRunware(params) {
    params.referenceImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    params.model = 'bytedance:4@1'
    return params
  }

  async applyImageFal(params) {
    params.image_url = await processSingleFile(params.files.image, 'datauri')
    params.model = 'fal-ai/bytedance/seededit/v3/edit-image'
    return params
  }

  getData() {
    return this.data
  }
}

export default SeedreamV3 