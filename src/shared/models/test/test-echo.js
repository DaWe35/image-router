import { PRICING_TYPES } from '../../PricingScheme.js'

class TestImage {
  constructor() {
    this.data = {
      id: 'test/echo',
      providers: [{
        id: 'test',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.00,
        },
        applyImage: this.applyImage,
        applyQuality: this.applyQuality
      }],
      arena_score: 0,
      examples: [
        {
          image: '/model-examples/test.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  applyImage(params) {
    if (Array.isArray(params.files.image)) {
      // For multiple images, add each image stream to an array
      // The objectToFormData function will handle appending each image with the same key
      params.image = params.files.image
    } else {
      // For a single image, return the path to the image file
      params.image = params.files.image
    }

    delete params.files.image
    return params
  }

  applyMask(params) {
    params.mask = params.files.mask
    delete params.files.mask
    return params
  }
}

export default TestImage 