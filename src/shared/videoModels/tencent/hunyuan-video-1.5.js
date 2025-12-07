import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple, processSingleOrMultipleFiles } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class HunyuanVideo15 {
  constructor() {
    this.data = {
      id: 'tencent/hunyuan-video-1.5',
      providers: [
        {
          id: 'wavespeed',
          model_name: 'wavespeed-ai/hunyuan-video-1.5/text-to-video',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.2
          },
          applyImage: this.applyImageWaveSpeed
        }
      ],
      release_date: '2025-11-21'
    }
  }

  getData() {
    return this.data
  }

  async applyImageWaveSpeed(params) {
    params.image = await processSingleFile(params.files.image)
    params.model = 'wavespeed-ai/hunyuan-video-1.5/image-to-video'
    delete params.files.image
    return params
  }
}
