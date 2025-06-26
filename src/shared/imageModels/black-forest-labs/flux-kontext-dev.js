import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyReferenceImages } from '../../applyImage.js'
import { postCalcRunware } from '../../../services/imageHelpers.js'

class FluxKontextPro {
  constructor() {
    this.data = {
      id: 'black-forest-labs/flux-kontext-dev',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:106@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcRunware,
            range: {
              min: 0.01,
              average: 0.01,
              max: 0.03
            }
          },
          applyImage: applyReferenceImages,
        }
      ],
      release_date: '2025-06-26'
    }
  }

  getData() {
    return this.data
  }
}

export default FluxKontextPro 