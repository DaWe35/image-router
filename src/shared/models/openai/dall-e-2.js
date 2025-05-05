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
}

export default DallE2