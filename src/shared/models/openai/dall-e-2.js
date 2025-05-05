import fs from 'fs'
import { PRICING_TYPES } from '../../PricingScheme.js'

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
        applyImage: this.applyImage,
        applyMask: this.applyMask
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

  applyImage(params) {
    if (Array.isArray(params.files.image)) {
      if (params.files.image.length !== 1) {
        throw new Error('DALL-E 2 does not support multiple images. Please provide only one image for editing.')
      }
      // Exactly one image provided in array
      params.image = fs.createReadStream(params.files.image[0].path)
    } else {
      // For a single image provided as an object
      params.image = fs.createReadStream(params.files.image.path)
    }

    console.log('params.image', params.image)

    delete params.files.image
    return params
  }

  applyMask(params) {
    params.mask = fs.createReadStream(params.files.mask.path)
    delete params.files.mask
    return params
  }
}

export default DallE2