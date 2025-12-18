import { PRICING_TYPES } from '../../PricingScheme.js'
import { calcVideoPrice } from '../../../services/imageHelpers.js'
import { applyImageSingleBase64, applyVertexImage } from '../../applyImage.js'

export default class {
  constructor() {
    this.data = {
      id: 'google/veo-3-fast',
      providers: [
        {
          id: 'gemini',
          model_name: 'veo-3.0-fast-generate-001',
          pricing: {
            type: PRICING_TYPES.CALCULATED,
            calcFunction: (params) => calcVideoPrice(params, 0.15), // $0.15 per second ($1.2 per 8s)
            range: {
              min: 0.6,
              average: 0.6,
              max: 1.2
            }
          },
          applyImage: applyImageSingleBase64
        }
        /* These have no input image implemented yet
        {
          id: 'vertex',
          model_name: 'veo-3.0-fast-generate-001',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 1.2
          },
          // applyImage: applyVertexImage
        }, {
          id: 'replicate',
          model_name: 'google/veo-3-fast',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 1.2
          }
        }, {
          id: 'wavespeed',
          model_name: 'google/veo3-fast', // no audio ?
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 1.2
          }
        } */
      ],
      release_date: '2025-06-12',
      seconds: [4, 6, 8],
      default_seconds: 4
    }
  }

  getData() {
    return this.data
  }
}
