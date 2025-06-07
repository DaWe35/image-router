import { PRICING_TYPES } from '../../PricingScheme.js'
import { SIZE_TYPES } from '../../SizeScheme.js'
import { Flux1Dev } from '../black-forest-labs/FLUX-1-dev.js'
const flux1Dev = new Flux1Dev()

class JuggernautLightningFlux {
  constructor() {
    this.data = {
      id: 'run-diffusion/Juggernaut-Lightning-Flux',
      providers: [{
        id: 'deepinfra',
        model_name: 'run-diffusion/Juggernaut-Lightning-Flux',
        pricing: {
          type: PRICING_TYPES.CALCULATED,
          calcFunction: flux1Dev.calculatePrice,
          range: {
            min: flux1Dev.calculatePrice('low', '128x128'),
            average: flux1Dev.calculatePrice('medium', '1024x1024'),
            max: flux1Dev.calculatePrice('high', '1920x1920')
          }
        }
      }],
      size: {
        type: SIZE_TYPES.RANGE,
        min: "128x128",
        max: "1920x1920",
        default: "1024x1024"
      },
      arena_score: null,
      release_date: '2025-03-05',
      examples: [
        {
          image: '/model-examples/Juggernaut-Lightning-Flux-2025-04-03T14-15-05-487Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default JuggernautLightningFlux 