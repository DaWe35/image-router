import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/imageHelpers.js'

class Seedance1Pro {
  constructor() {
    this.data = {
      id: 'bytedance/seedance-1-pro',
      providers: [{
        id: 'wavespeed',
        model_name: 'bytedance/seedance-v1-pro-t2v-720p',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.3,
        },
      }],
      arena_score: 1295,
      release_date: '2025-06-16',
      examples: []
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

export default Seedance1Pro