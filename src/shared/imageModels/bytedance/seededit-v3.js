import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyReferenceImages } from '../../applyImage.js'
import { applyFalImage } from '../../applyImage.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

class SeedreamEditV3 {
  constructor() {
    this.data = {
      id: 'bytedance/seededit-3',
      providers: [
        {
          id: 'fal',
          model_name: 'fal-ai/bytedance/seededit/v3/edit-image',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.03,
          },
          applyImage: applyFalImage
        },
        {
          id: 'runware', // MODERATION ISSUES WITH THIS PROVIDER
          model_name: 'bytedance:4@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.03,
          },
          applyImage: applyReferenceImages
        }
      ],
      release_date: '2025-07-06'
    }
  }

  getData() {
    return this.data
  }
}

export default SeedreamEditV3 