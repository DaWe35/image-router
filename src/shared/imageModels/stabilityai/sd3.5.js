import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'

class Sd35 {
  constructor() {
    this.data = {
      id: 'stabilityai/sd3.5',
      providers: [
        {
          id: 'replicate',
          model_name: 'stability-ai/stable-diffusion-3.5-large',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.065,
          }
        }
      ],
      release_date: '2024-10-22'
    }
  }

  applyQuality(params) {
    const qualitySteps = {
      low: 25,
      medium: 35,
      high: 50
    }
    params.num_inference_steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}

export default Sd35 