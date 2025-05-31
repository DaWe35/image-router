import { PRICING_TYPES } from '../../PricingScheme.js'

class JuggernautFlux {
  constructor() {
    this.data = {
      id: 'run-diffusion/Juggernaut-Flux',
      providers: [{
        id: 'deepinfra',
        model_name: 'run-diffusion/Juggernaut-Flux',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.009,
        }
      }],
      arena_score: null,
      release_date: '2025-03-05',
      examples: [
        {
          image: '/model-examples/Juggernaut-Flux-2025-04-03T14-15-04-136Z.webp'
        }
      ]
    }
  }

  getData() {
    return this.data
  }
}

export default JuggernautFlux 