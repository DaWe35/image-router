import { PRICING_TYPES } from '../../PricingScheme.js'

class SeedreamV3 {
  constructor() {
    this.data = {
      id: 'bytedance/seedream-3',
      providers: [{
        id: 'fal',
        model_name: 'fal-ai/bytedance/seedream/v3/text-to-image',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.03,
        },
        applyImage: this.applyImage
      }],
      release_date: '2025-04-16',
      arena_score: 1160,
      examples: [
        {
          image: '/model-examples/seedream-3-2025-06-16T17-59-52-679Z.webp'
        }
      ]
    }
  }

  async applyImage(params) {
    params.image_url = await processSingleFile(params.files.image, 'datauri')
    params.model = 'fal-ai/bytedance/seededit/v3/edit-image'
    delete params.files.image
    return params
  }

  getData() {
    return this.data
  }
}

export default SeedreamV3 