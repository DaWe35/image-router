import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingle, applyVertexImage } from '../../applyImage.js'

export default class Veo3Fast {
  constructor() {
    this.data = {
      id: 'google/veo-3-fast',
      providers: [
        {
          id: 'gemini',
          model_name: 'veo-3.0-fast-generate-001',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 1.2
          },
          applyImage: applyImageSingle
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
      release_date: '2025-06-12'
    }
  }

  getData() {
    return this.data
  }
}
