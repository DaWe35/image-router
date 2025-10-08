import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple, processSingleOrMultipleFiles, postCalcNanoGPTDiscounted5 } from '../../../services/imageHelpers.js'
import { applyImageNanoGPT } from '../../applyImage.js'

export default class SeedreamV4 {
  constructor() {
    this.data = {
      id: 'bytedance/seedream-4',
      providers: [
        {
          id: 'nanogpt',
          model_name: 'seedream-v4',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcNanoGPTDiscounted5,
            value: 0.03,
          },
          applyImage: applyImageNanoGPT,
        }, {
          id: 'runware',
          model_name: 'bytedance:5@0',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.03,
          },
          applyImage: this.applyImageRunware
        }
      ],
      release_date: '2025-09-09',
      arena_score: 1227,
      examples: [
        {
          image: '/model-examples/seedream-4-2025-09-10T09-26-01-864Z.webp'
        }
      ],
      sizes: [
        '1024x1024',
        '2048x2048',
        '2304x1728',
        '1728x2304',
        '2560x1440',
        '1440x2560',
        '2496x1664',
        '1664x2496',
        '3024x1296',
        '4096x4096',
        '4608x3456',
        '3456x4608',
        '5120x2880',
        '2880x5120',
        '4992x3328',
        '3328x4992',
        '6048x2592'
      ]
    }
  }

  async applyImageRunware(params) {
    params.referenceImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    return params
  }

  getData() {
    return this.data
  }
}
