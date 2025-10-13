import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple, processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'
import { applyReferenceImages } from '../../applyImage.js'

class QwenImageEditPlus {
  constructor() {
    this.data = {
      id: 'qwen/qwen-image-edit-plus',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:108@22',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.0083
          },
          applyImage: applyReferenceImages
        }
      ],
      arena_score: 1092,
      release_date: '2025-08-18',
      examples: [
        {
          image: '/model-examples/qwen-image-edit-plus-2025-10-13.webp'
        }
      ]

    }
  }

  getData() {
    return this.data
  }
}

export default QwenImageEditPlus