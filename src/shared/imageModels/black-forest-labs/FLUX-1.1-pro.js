import { PRICING_TYPES } from '../../PricingScheme.js'
import { postCalcSimple } from '../../../services/imageHelpers.js'

class Flux11Pro {
  constructor() {
    this.data = {
      id: 'black-forest-labs/FLUX-1.1-pro',
      providers: [
        {
          id: 'runware',
          model_name: 'bfl:2@1',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.04
          }
        }, {
          id: 'deepinfra',
          model_name: 'black-forest-labs/FLUX-1.1-pro',
          pricing: {
            type: PRICING_TYPES.POST_GENERATION,
            postCalcFunction: postCalcSimple,
            value: 0.04
          }
        }
      ],
      release_date: '2024-11-02'
      
    }
  }

  getData() {
    return this.data
  }
}

export default Flux11Pro 