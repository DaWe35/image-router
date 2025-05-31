import { PRICING_TYPES } from '../../PricingScheme.js'

class JuggernautLightningFlux {
  constructor() {
    this.data = {
      id: 'run-diffusion/Juggernaut-Lightning-Flux',
      providers: [{
        id: 'deepinfra',
        model_name: 'run-diffusion/Juggernaut-Lightning-Flux',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.009,
        }
      }],
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