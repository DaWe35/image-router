import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile } from '../../../services/helpers.js'
import { applyImageSingleDataURI } from '../../applyImage.js'

class Grok2Image {
  constructor() {
    this.data = {
      id: 'xAI/grok-imagine-image',
      providers: [{
        id: 'grok',
        model_name: 'grok-imagine-image',
        pricing: {
          type: PRICING_TYPES.CALCULATED,
          calcFunction: this.calcPrice,
          range: {
            min: 0.02,
            average: 0.02,
            max: 0.022
          }
        },
        applyImage: applyImageSingleDataURI,
      }],
      release_date: '2025-07-28',
      sizes: [
        '1024x1024',
        '1280x896',
        '896x1280',
        '1408x768',
        '768x1408',
        '1296x864',
        '864x1296',
        '1248x576',
        '576x1248',
        '1280x576',
        '576x1280',
        '1248x832',
        '832x1248',
        '1408x704',
        '704x1408',
      ]
    }
  }

  calcPrice(params) {
    const basePrice = 0.02
    const inputImageCount = params?.images?.length || 0
    const inputImageCost = inputImageCount * 0.002
    return basePrice + inputImageCost
  }

  getData() {
    return this.data
  }
}

export default Grok2Image

