import { PRICING_TYPES } from '../../PricingScheme.js'

export default class {
  constructor() {
    this.data = {
      id: 'zai/glm-image',
      sizes: [
        '1024x1024',
        '2048x2048',
        '512x512',
        '1280x1280',
        '1568x1056',
        '1056x1568',
        '1472x1088',
        '1088x1472',
        '1728x960',
        '960x1728',
        '1024x768',
        '768x1024',
        '1024x576',
        '576x1024',
      ],
      providers: [
        {
          id: 'zai',
          model_name: 'glm-image',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.015
          },
          applyQuality: this.applyQuality,
        }
      ],
      release_date: '2026-01-14'
    }
  }

  getData() {
    return this.data
  }

  applyQuality(params) {
    if (params.quality === 'low') {
      params.quality = 'standard'
    } else {
      params.quality = 'hd'
    }
    return params
  }
}
