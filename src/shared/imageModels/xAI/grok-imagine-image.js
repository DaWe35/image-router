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
      release_date: '2026-01-28',
      sizes: [
        '1024x1024', // 1:1
        '1280x896', // 4:3
        '896x1280', // 3:4
        '1408x768', // 16:9
        '768x1408', // 9:16
        '1296x864', // 3:2
        '864x1296', // 2:3
        '1248x576', // 19.5:9
        '576x1248', // 9:19.5
        '1280x576', // 20:9
        '576x1280', // 9:20
        '1408x704', // 2:1
        '704x1408', // 1:2
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

