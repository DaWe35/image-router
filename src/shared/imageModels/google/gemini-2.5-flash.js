import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleOrMultipleFiles } from '../../../services/helpers.js'
import { postCalcSimple } from '../../../services/helpers.js'
import { applyReferenceImages } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'google/gemini-2.5-flash',
      sizes: [
        '1024x1024',
        '832x1248',
        '1248x832',
        '864x1184',
        '1184x864',
        '896x1152',
        '1152x896',
        '768x1344',
        '1344x768',
        '1536x672',
      ],
      providers: [
        {
          id: 'gemini',
          model_name: 'gemini-2.5-flash-image',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: this.postCalcPrice,
            value: 0.0293,  // Official ~$0.0387/image (1290 tokens @ $30/1M), 25% discount
          },
          applyImage: this.applyImageGemini,
        }, {
          id: 'runware',
          model_name: 'google:4@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.039,
          },
          applyImage: applyReferenceImages,
        }, {
          id: 'vertex',
          model_name: 'gemini-2.5-flash-image',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.0293,  // Official ~$0.0387/image (1290 tokens @ $30/1M), 25% discount
          },
          applyImage: this.applyImageVertex
        }
      ],
      release_date: '2025-10-02'
    }
  }

  getData() {
    return this.data
  }

  async applyImageVertex(params) {
    const processedImages = await processSingleOrMultipleFiles(params.files.image, 'datauri')
    params.imagesData = Array.isArray(processedImages) ? processedImages : [processedImages]
    return params
  }

  async applyImageGemini(params) {
    const processedImages = await processSingleOrMultipleFiles(params.files.image)
    params.imagesData = Array.isArray(processedImages) ? processedImages : [processedImages]
    return params
  }

  postCalcPrice(imageResult, params) {
    // Official: 1290 tokens per 1024x1024 image @ $30/1M tokens = $0.0387 per image
    const officialPricePerImage = (1290 / 1_000_000) * 30
    const numberOfImages = imageResult.data ? imageResult.data.length : 1
    const officialTotal = officialPricePerImage * numberOfImages
    return officialTotal * 0.75  // 25% discount applied at the end
  }
}
