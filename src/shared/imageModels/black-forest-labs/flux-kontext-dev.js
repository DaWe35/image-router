import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyReferenceImages } from '../../applyImage.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

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
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.01,
              average: 0.0105,
              max: 0.007
            }
          },
          applyImage: applyReferenceImages,
        }
      ],
      release_date: '2025-06-26',
      examples: [
        {
          image: '/model-examples/flux-kontext-dev-2025-06-26T20-32-46-915Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default FluxKontextPro 