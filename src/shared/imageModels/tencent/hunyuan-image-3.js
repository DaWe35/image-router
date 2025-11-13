import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles, processSingleFile, postCalcNanoGPTDiscounted10 } from '../../../services/imageHelpers.js'
import { applyImageNanoGPT } from '../../applyImage.js'

export default class HunyuanImage3 {
  constructor() {
    this.data = {
      id: 'tencent/hunyuan-image-3',
      providers: [
        {
          id: 'nanogpt',
          model_name: 'hunyuan-image-3',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcNanoGPTDiscounted10,
            value: 0.05
          },
          applyQuality: this.applyQuality,
          applyImage: applyImageNanoGPT,
        }, {
          id: 'replicate',
          model_name: 'tencent/hunyuan-image-3',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.08
          },
        }
      ],
      release_date: '2025-09-28'
    }
  }

  getData() {
    return this.data
  }
}
