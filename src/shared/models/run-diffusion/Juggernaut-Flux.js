import { PRICING_TYPES } from '../../PricingScheme.js'

class JuggernautFlux {
  constructor() {
    this.data = {
      id: 'run-diffusion/Juggernaut-Flux',
      providers: [{
        name: 'deepinfra',
        pricing: {
          type: PRICING_TYPES.FIXED,
          value: 0.009,
        }
      }],
      arenaScore: null,
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