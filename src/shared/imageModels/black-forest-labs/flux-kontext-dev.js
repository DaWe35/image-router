import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyReferenceImages } from '../../applyImage.js'
import { postCalcSimple } from '../../../services/helpers.js'

class FluxKontextPro {
  constructor() {
    this.data = {
      id: 'black-forest-labs/flux-kontext-dev',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:106@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.0073,
              average: 0.0105,
              max: 0.0214
            }
          },
          applyImage: applyReferenceImages,
          applyQuality: this.applyQuality
        }
      ],
      release_date: '2025-06-26'
    }
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 15,
      medium: 25,
      high: 45
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}

export default FluxKontextPro 