import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingleDataURI } from '../../applyImage.js'

export default class Ghibli {
  constructor() {
    this.data = {
      id: 'wavespeed/ghibli',
      providers: [{
        id: 'wavespeed',
        model_name: 'wavespeed-ai/ghibli',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.005,
        },
        applyImage: applyImageSingleDataURI,
      }],
      /* release_date: '2025-06-29',
      examples: [
        {
          image: '/model-examples/pasaranax:443821@1957537.webp'
        }
      ] */
    }
  }

  getData() {
    return this.data
  }
}
