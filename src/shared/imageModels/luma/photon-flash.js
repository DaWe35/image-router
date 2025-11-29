import { PRICING_TYPES } from '../../PricingScheme.js'

class PhotonFlash {
  constructor() {
    this.data = {
      id: 'luma/photon-flash',
      providers: [
        /*
        Sync mode is broken for this model
        {
          id: 'wavespeed',
          model_name: 'luma/photon-flash',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.005,
          },
        },  */{
          id: 'replicate',
          model_name: 'luma/photon-flash',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.01
          }
        }
      ],
      arena_score: 964,
      release_date: '2024-12-03'
      
    }
  }

  getData() {
    return this.data
  }
}

export default PhotonFlash 