import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles } from '../../../services/helpers.js'

export default class {
  constructor() {
    this.data = {
      id: 'google/gemini-3-pro:free',
      sizes: [
        '1024x1024',
      ],
      providers: [
        {
          id: 'gemini',
          model_name: 'gemini-3-pro-image-preview',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0
          },
          applyImage: this.applyImageGemini
        },
        {
          id: 'vertex',
          model_name: 'gemini-3-pro-image-preview',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0
          },
          applyImage: this.applyImageVertex
        }
      ],
      release_date: '2026-02-18'
    }
  }

  getData() {
    return this.data
  }

  async applyImageGemini(params) {
    const processedImages = await processSingleOrMultipleFiles(params.files.image)
    params.imagesData = Array.isArray(processedImages) ? processedImages : [processedImages]
    return params
  }

  async applyImageVertex(params) {
    const processedImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    params.imagesData = Array.isArray(processedImages) ? processedImages : [processedImages]
    return params
  }
}
