import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'

class Flux11Pro {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1.1-pro',
      providers: [{
        id: 'deepinfra',
        model_name: 'black-forest-labs/FLUX-1.1-pro',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.04,
        }
      }],
      size: {
        type: SIZE_TYPES.FIXED,
        // https://deepinfra.com/black-forest-labs/FLUX-1.1-pro
        options: [
          // Square sizes
          "256x256", "320x320", "384x384", "448x448", "512x512", "576x576", 
          "640x640", "704x704", "768x768", "832x832", "896x896", "960x960", 
          "1024x1024", "1088x1088", "1152x1152", "1216x1216", "1280x1280", 
          "1344x1344", "1408x1408", "1440x1440",
          
          // Portrait (9:16 and similar)
          "576x1024", "608x1088", "640x1152", "672x1216", "768x1344", "810x1440",
          
          // Portrait (3:4 and similar)
          "768x1024", "864x1152", "960x1280", "1080x1440",
          
          // Portrait (2:3)
          "640x960", "768x1152", "896x1344",
          
          // Landscape (16:9 and similar)
          "1024x576", "1088x608", "1152x640", "1216x672", "1344x768", "1440x810",
          
          // Landscape (4:3 and similar)
          "1024x768", "1152x864", "1280x960", "1440x1080",
          
          // Landscape (3:2)
          "960x640", "1152x768", "1344x896",
          
          // Cinematic (21:9 and similar)
          "1440x608", "1344x576", "1216x512", "1088x448",
          
          // Ultra-wide
          "1440x512", "1280x448", "1152x384",
          
          // Common web/social media sizes
          "512x640", "640x800", "800x1024", "1024x800",
          "512x768", "768x512", "640x480", "480x640",
          
          // Banner/header sizes
          "1440x384", "1344x352", "1216x320", "1088x288", "960x256"
        ],
        default: "1024x1024"
      },
      arena_score: 1082,
      release_date: '2024-11-02',
      examples: [
        {
          image: '/model-examples/FLUX-1.1-pro.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default Flux11Pro 