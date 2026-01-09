import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/helpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'tencent/hunyuan-video-1.5',
      providers: [
        {
          id: 'wavespeed',
          model_name: 'wavespeed-ai/hunyuan-video-1.5/text-to-video',
          pricing: {
            type: PRICING_TYPES.CALCULATED,
            calcFunction: this.calcHunyuanWaveSpeedPrice,
            value: 0.2 // $0.2 per 5s
          },
          applyImage: this.applyImageWaveSpeed
        }
      ],
      sizes: [
        '832x480',
        '480x832',
        '1280x720',
        '720x1280'
      ],
      release_date: '2025-11-21',
      seconds: [5, 8],
      default_seconds: 5
    }
  }

  getData() {
    return this.data
  }

  async applyImageWaveSpeed(params) {
    params.image = await processSingleFile(params.files.image, 'datauri')
    params.model = 'wavespeed-ai/hunyuan-video-1.5/image-to-video'
    delete params.files.image
    return params
  }

  calcHunyuanWaveSpeedPrice(params) {
    let pricePerSecond
    const size = params.size

    if (size === '832x480' || size === '480x832') {
      pricePerSecond = 0.02
    } else if (size === '1280x720' || size === '720x1280') {
      pricePerSecond = 0.04
    } else {
      throw new Error('Invalid size for Hunyuan Video 1.5 - price calculation failed')
    }
    try {
        return pricePerSecond * params.seconds
    } catch (error) {
        console.error('Error calculating video price:', error)
        return 10 // return 1 for safety, this should never happen
    }
  }
}
