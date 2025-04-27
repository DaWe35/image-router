import { models } from './models/index.js'
import { PRICING_TYPES } from '../PricingScheme.js'

// Convert USD price to database format (multiply by 10000 to get 4 decimal places)
export function convertPriceToDbFormat(usdPrice) {
    return Math.ceil(usdPrice * 10000)
}

// Pre-calculate the price for the model. This is used to deduct credits before the image is generated.
// If the price cannot be calculated before image generation, return the max price.
export function preCalcPrice(modelName, size, quality) {
    const modelConfig = models[modelName]
    switch (modelConfig.providers[0].pricing.type) {
        case PRICING_TYPES.FIXED:
            return modelConfig.providers[0].pricing.value
        case PRICING_TYPES.CALCULATED:
            return modelConfig.providers[0].pricing.calcFunction(quality)
        case PRICING_TYPES.POST_GENERATION:
            return modelConfig.providers[0].pricing.range.max
        default:
            throw new Error('Invalid price format for model ' + modelConfig.name + ', please contact support')
    }
}

// Post-calculate the price for models that cannot be estimated before image generation.
export function postCalcPrice(modelName, imageResult) {
    const modelConfig = models[modelName]
    if (modelConfig.providers[0].pricing.type === PRICING_TYPES.POST_GENERATION) {
        return modelConfig.providers[0].pricing.postCalcFunction(imageResult)
    } else {
    // return the pre-calculated price as default
    return preCalcPrice(modelConfig)
    }

}
