import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/imageHelpers.js'

class Seedance1 {
  constructor() {
    this.data = {
      id: 'bytedance/seedance-1',
      providers: [{
        id: 'fal',
        model_name: 'fal-ai/bytedance/seedance/v1/lite/text-to-video',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.186,
        },
      }],
      arena_score: 1197,
      release_date: '2025-06-16',
      examples: [
        {
          video: '/model-examples/seedance-1-2025-06-16T19-01-20-528Z.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

/*
Broken, fix it later
async applyImage(params) {
    params.image = await processSingleFile(params.files.image)
    params.model = 'fal-ai/bytedance/seedance/v1/lite/image-to-video'
    throw new Error('Apply')
    delete params.files.image
    return params
  } */
}

export default Seedance1