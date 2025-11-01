import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageSingle } from '../../applyImage.js'

export default class BriaFibo {
  constructor() {
    this.data = {
      id: 'bria/bria-fibo',
      providers: [
        {
          id: 'runware',
          model_name: 'bria:20@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.04,
          },
          applyImage: applyImageSingle,
          applyQuality: this.applyQuality,
        }
      ],
      release_date: '2025-10-29',
      examples: [
        {
          image: '/model-examples/bria-fibo-2025-11-01T23-14-49-468Z-compressed.webp'
        }
      ],
      sizes: [
        '1024x1024',
        '1152x896',
        '1344x768',
        '1216x832',
        '896x1152',
        '768x1344',
        '832x1216',
        '1088x896',
        '896x1088',
      ]
    }
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 30,
      medium: 50,
      high: 50
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}
