import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles, processSingleFile, postCalcSimple } from '../../../services/imageHelpers.js'
import { applyInputImagesReferences } from '../../applyImage.js'


export default class {
  constructor() {
    this.data = {
      id: 'openai/gpt-image-1.5:free',
      providers: [
        {
          id: 'runware',
          model_name: 'openai:4@1',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0
          },
          applyQuality: this.applyQualityRunware,
          applyImage: applyInputImagesReferences,
        },
        {
          id: 'openai',
          model_name: 'gpt-image-1.5',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0
          },
          applyQuality: this.applyQuality,
          applyImage: this.applyImage,
          applyMask: this.applyMask,
        }
      ],
      release_date: '2025-12-16',
      sizes: [
        'auto',
        '1024x1024',
        '1536x1024',
        '1024x1536'
      ]
    }
  }

  getData() {
    return this.data
  }

  applyQualityRunware(params) {
    const allowedQualities = ['auto', 'low']
    if (!allowedQualities.includes(params.quality)) {
      throw new Error(`High and medium quality are available in the paid model. For this free model, please use 'low' quality.`)
    }
    // Convert 'auto' to 'low' for free tier
    params.openai_quality = 'low'
    delete params.quality
    return params
  }

  applyQuality(params) {
    const allowedQualities = ['auto', 'low']
    if (!allowedQualities.includes(params.quality)) {
      throw new Error(`High and medium quality are available in the paid model. For this free model, please use 'low' quality.`)
    }
    // Convert 'auto' to 'low' for free tier
    params.quality = 'low'
    return params
  }

  async applyImage(params) {
    params.image = await processSingleOrMultipleFiles(params.files.image)
    delete params.files.image
    return params
  }

  async applyMask(params) {
    params.mask = await processSingleFile(params.files.mask)
    delete params.files.mask
    return params
  }
}

