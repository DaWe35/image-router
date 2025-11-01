import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

export default class Kling25TurboStandard {
  constructor() {
    this.data = {
      id: 'kwaivgi/kling-2.5-turbo-standard',
      providers: [
        {
          id: 'runware',
          model_name: 'klingai:6@0',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.21,
          },
          applyImage: applyImageRunwareVideo,
        }
      ],
      arena_score: 1241,
      release_date: '2025-09-23',
      examples: [
        {
          video: '/model-examples/kling-2.5-turbo-standard-2025-11-01T23-16-48-641Z.webm'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}
