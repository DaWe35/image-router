import { PRICING_TYPES } from '../../PricingScheme.js'
import { processSingleFile, postCalcSimple, calcVideoPrice } from '../../../services/imageHelpers.js'
import { applyImageRunwareVideo } from '../../applyImage.js'

class Hailuo02Standard {
  constructor() {
    this.data = {
      id: 'minimax/hailuo-02-standard',
      providers: [
        {
          id: 'runware',
          model_name: 'minimax:3@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.231,
          },
          applyImage: applyImageRunwareVideo
        }, {
          id: 'wavespeed',
          model_name: 'minimax/hailuo-02/standard',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.23,
          },
          applyImage: this.applyImageWaveSpeed
        }
      ],
      release_date: '2025-06-18',
      sizes: [
        '512x512',
        '1366x768',
        '1920x1080'
      ],
      seconds: [6],
      default_seconds: 6,
    }
  }

  getData() {
    return this.data
  }

  async applyImageWaveSpeed(params) {
    params.image = await processSingleFile(params.files.image, 'datauri')
    delete params.files.image
    return params
  }
}

export default Hailuo02Standard 