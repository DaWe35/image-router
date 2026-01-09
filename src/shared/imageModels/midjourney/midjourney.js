import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcNanoGPTDiscounted5 } from '../../../services/helpers.js'
import { applyImageSingleDataURI } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'midjourney/midjourney',
      providers: [
        {
          id: 'nanogpt',
          model_name: 'midjourney',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcNanoGPTDiscounted5,
            value: 0.0848,
          },
          applyImage: applyImageSingleDataURI,
        },
      ],
      release_date: '2025-06-17',
    }
  }

  getData() {
    return this.data
  }
}
