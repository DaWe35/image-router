import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcNanoGPTDiscounted5 } from '../../../services/imageHelpers.js'
import { applyImageSingleDataURI } from '../../applyImage.js'

export default class Midjourney {
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
      arena_score: 1049,
      /* examples: [
        {
          image: '/model-examples/seedream-3-2025-06-16T17-59-52-679Z.webp'
        }
      ] */
    }
  }

  getData() {
    return this.data
  }
}
