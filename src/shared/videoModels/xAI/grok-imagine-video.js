import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingleDataURI } from '../../applyImage.js'
import { wrongGrokVideoSizeToAspectRatio } from '../../../services/helpers.js'

class GrokImagineVideo {
  constructor() {
    this.data = {
      id: 'xAI/grok-imagine-video',
      providers: [{
        id: 'grok',
        model_name: 'grok-imagine-video',
        pricing: {
          type: PRICING_TYPES.CALCULATED,
          calcFunction: this.calcPrice,
          range: {
            min: 0.05,
            average: 0.35,
            max: 1.052
          }
        },
        applyImage: applyImageSingleDataURI,
      }],
      release_date: '2026-01-28',
      sizes: [
        // 720p
        '1280x720', // 16:9
        '960x720', // 4:3
        '1088x720', // 3:2
        '720x720', // 1:1
        '720x1088', // 2:3
        '720x960', // 3:4
        '720x1280', // 9:16
        // 480p
        '848x480', // 16:9
        '640x480', // 4:3
        '720x480', // 3:2
        '480x480', // 1:1
        '480x720', // 2:3
        '480x640', // 3:4
        '480x848', // 9:16
      ],
      seconds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      default_seconds: 5
    }
  }

  calcPrice(params) {
    // Base input costs
    let cost = 0
    
    // Input image: $0.002
    if (params?.image) {
      cost += 0.002
    }
    
    // Add input video cost when available https://docs.x.ai/docs/models/grok-imagine-video
    
    // Detect resolution
    let resolution = '720p'
    if (params.size && params.size !== 'auto') {
        const mapping = wrongGrokVideoSizeToAspectRatio[params.size]
        if (mapping) {
            resolution = mapping.resolution
        }
    }
    
    // Add resolution-specific cost per second
    if (resolution === '480p') {
      cost += 0.05 * params.seconds
    } else if (resolution === '720p') {
      cost += 0.07 * params.seconds
    }
    
    return cost
  }

  getData() {
    return this.data
  }
}

export default GrokImagineVideo
