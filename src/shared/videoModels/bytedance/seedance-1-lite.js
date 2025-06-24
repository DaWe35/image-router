import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/imageHelpers.js'

class Seedance1Lite {
  constructor() {
    this.data = {
      id: 'bytedance/seedance-1-lite',
      providers: [{
        id: 'wavespeed',
        model_name: 'bytedance/seedance-v1-lite-t2v-720p',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.16,
        },
      }],
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

export default Seedance1Lite