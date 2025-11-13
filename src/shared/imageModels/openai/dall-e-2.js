import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/imageHelpers.js'

class DallE2 {
  constructor() {
    this.data = {
      id: 'openai/dall-e-2',
      sizes: [
        '1024x1024',
        '1024x1536',
        '1536x1024',
      ],
      providers: [{
        id: 'openai',
        model_name: 'dall-e-2',
        pricing: {
          type: PRICING_TYPES.CALCULATED,
          calcFunction: this.calculatePrice,
          range: {
            min: 0.016,
            average: 0.016,
            max: 0.02
          },
        },
        applyQuality: this.applyQuality,
        /* applyImage: this.applyImage,
        applyMask: this.applyMask */
      }],
      arena_score: 695,
      release_date: '2022-04-6'
    }
  }

  getData() {
    return this.data
  }

  calculatePrice(params) {
    switch (params.size) {
      case '1024x1024':
        return 0.016
      case '1024x1536':
        return 0.018
      case '1536x1024':
        return 0.02
      default:
        return 0.016
    }
  }

  applyQuality(params) {
    delete params.quality // Dall-E 2 does not support quality, even if their docs say it does. Default quality is standard, no other options available.
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