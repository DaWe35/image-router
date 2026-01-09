import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'
import { applyImagesReferences1024x1024 } from '../../applyImage.js'


export default class {
  constructor() {
    this.data = {
      id: 'sourceful/riverflow-1',
      providers: [{
        id: 'runware',
        model_name: 'sourceful:1@1',
        pricing: {
          type: PRICING_TYPES.POST_GENERATION,
          postCalcFunction: postCalcSimple,
          value: 0.066,
        },
        applyImage: applyImagesReferences1024x1024
      }],
      release_date: '2025-10-15',
      sizes: [
        '1024x1024',
        '1152x864',
        '1280x720',
        '1248x832',
        '1512x648',
        '864x1152',
        '720x1280',
        '832x1248',
        '648x1512',
        '1152x896',
        '896x1152'
      ]
    }
  }

  getData() {
    return this.data
  }
}
