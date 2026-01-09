import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/helpers.js'

export default class {
  constructor() {
    this.data = {
      id: 'Tongyi-MAI/Z-Image-Turbo',
      providers: [
        {
          id: 'runware',
          model_name: 'runware:z-image@turbo',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            range: {
              min: 0.0006,
              average: 0.0019,
              max: 0.0115
            }
          },
          applyQuality: this.applyQualityRunware
        },
        {
          id: 'replicate',
          model_name: 'prunaai/z-image-turbo:7ea16386290ff5977c7812e66e462d7ec3954d8e007a8cd18ded3e7d41f5d7cf',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            range: {
              min: 0.0005,
              average: 0.0037,
              max: 0.0667
            },
            postCalcFunction: this.postCalcReplicate,
          },
          applyQuality: this.applyQualityReplicate
        },
        {
          id: 'fal',
          model_name: 'fal-ai/z-image/turbo',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.005
          },
          applyQuality: this.applyQualityFal
        }
      ],
      release_date: '2025-11-25'
    }
  }

  applyQualityRunware(params) {
    const qualitySteps = {
      low: 4,
      medium: 8,
      high: 16
    }
    params.steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  applyQualityReplicate(params) {
    const qualitySteps = {
      low: 4,
      medium: 8,
      high: 16
    }
    params.num_inference_steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  postCalcReplicate(imageResult) {
    return imageResult.replicate_predict_time * 0.001525 // single H100 price per second https://replicate.com/pricing#hardware
  }

  applyQualityFal(params) {
    const qualitySteps = {
      low: 4,
      medium: 8,
      high: 8
    }
    params.num_inference_steps = qualitySteps[params.quality] ?? qualitySteps['medium']
    delete params.quality
    return params
  }

  getData() {
    return this.data
  }
}
