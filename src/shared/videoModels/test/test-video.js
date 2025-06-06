import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class TestVideo {
  constructor() {
    this.data = {
      id: 'ir/test-video',
      providers: [{
        id: 'test',
        model_name: 'ir/test-video',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.00,
        },
        applyQuality: this.applyQuality,
        applyImage: this.applyImage,
        applyMask: this.applyMask,
      }],
      size: {
        type: SIZE_TYPES.RANGE,
        min: "480x480",
        max: "1920x1080",
        default: "1280x720"
      },
      arena_score: 0,
      release_date: '2025-05-04',
      examples: [
        {
          video: 'https://raw.githubusercontent.com/DaWe35/image-router/refs/heads/main/src/shared/videoModels/test/big_buck_bunny_720p_1mb.mp4'
        }
      ]
    }
  }

  getData() {
    return this.data
  }

  applyQuality(params) {
    // Change nothing, values are already valited in validateParams.js
    return params
  }

  applyImage(params) {
    // Change nothing, values are already valited in validateParams.js
    return params
  }

  applyMask(params) {
    // Change nothing, values are already valited in validateParams.js
    return params
  }
}

export default TestVideo 