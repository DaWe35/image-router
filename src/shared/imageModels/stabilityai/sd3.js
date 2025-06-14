import { PRICING_TYPES } from '../../PricingScheme.js'

class Sd3 {
  constructor() {
    this.data = {
      id: 'stabilityai/sd3',
      providers: [{
        id: 'runware',
        model_name: 'runware:5@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: this.postCalcPrice,
          range: {
            min: 0.0006,
            average: 0.0019,
            max: 0.0064
          }
        },
        applyImage: this.applyImage,
        applyMask: this.applyMask
      }],
      arena_score: 1015,
      release_date: '2025-06-01',
      examples: [
        {
          image: '/model-examples/runware-sd3-example.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  async applyImage(params) {
    const { encodeFileToDataURI } = await import('../../../services/imageHelpers.js')

    const images = params.files.image
    const file = Array.isArray(images) ? images[0] : images
    params.image = await encodeFileToDataURI(file)
    delete params.files.image
    return params
  }

  async applyMask(params) {
    const { encodeFileToDataURI } = await import('../../../services/imageHelpers.js')
    const file = params.files.mask
    params.mask = await encodeFileToDataURI(file)
    delete params.files.mask
    return params
  }
}

export default Sd3