import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyReferenceImages } from '../../applyImage.js'
import { applyFalImage } from '../../applyImage.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

class SeedEditV3 {
  constructor() {
    this.data = {
      id: 'bytedance/seededit-3',
      providers: [
        {
          id: 'runware',
          model_name: 'bytedance:4@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.03,
          },
          applyImage: applyReferenceImages
        },
        {
          id: 'fal',
          model_name: 'fal-ai/bytedance/seededit/v3/edit-image',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.03,
          },
          applyImage: applyFalImage
        }
      ],
      release_date: '2025-07-06',
      examples: [
        {
          image: '/model-examples/seededit-3-2025-10-13.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default SeedEditV3 