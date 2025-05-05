import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/imageHelpers.js'

class DallE2 {
  constructor() {
    this.data = {
      id: 'openai/dall-e-2',
      providers: [{
        id: 'openai',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.02,
        },
        applyQuality: this.applyQuality,
        /* applyImage: this.applyImage,
        applyMask: this.applyMask */
      }],
      arena_score: 714,
      examples: [
        {
          image: '/model-examples/dall-e-2.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  applyQuality(params) {
    delete params.quality // Dall-E 2 does not support quality, even if their docs say it does. Default quality is standard, no other options available..
    return params
  }

/*   async applyImage(params) {
    // max 1 image
    if (params.files.image.length > 1) {
      throw new Error('Dall-E 2 does not support multiple images')
    }
    params.image = await processSingleFile(params.files.image[0])
    delete params.files.image
    return params
  }

  async applyMask(params) {
    params.mask = await processSingleFile(params.files.mask)
    delete params.files.mask
    return params
  } */
}

export default DallE2