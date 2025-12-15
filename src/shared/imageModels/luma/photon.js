import { PRICING_TYPES } from '../../PricingScheme.js'

class Photon {
  constructor() {
    this.data = {
      id: 'luma/photon',
      providers: [/*
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
          model_name: 'luma/photon',
          pricing: {
            type: PRICING_TYPES.FIXED,
            value: 0.03
          }
        }
    ],
      release_date: '2024-12-03'
      
    }
  }

  getData() {
    return this.data
  }
}

export default Photon 