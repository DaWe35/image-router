import { PRICING_TYPES } from '../../PricingScheme.js'
import { applyImageSingleDataURI } from '../../applyImage.js'

export default class Hailuo02Pro {
  constructor() {
    this.data = {
      id: 'minimax/hailuo-02-pro',
      providers: [{
        id: 'wavespeed',
        model_name: 'minimax/hailuo-02/pro',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.49, // price per video in USD
        },
        applyImage: applyImageSingleDataURI,
      }],
      arena_score: 1322,
      release_date: '2025-06-18'
    }
  }

  getData() {
    return this.data
  }
}
