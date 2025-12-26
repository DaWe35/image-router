import { imageModels } from './imageModels/index.js'
import { videoModels } from './videoModels/index.js'
import { PRICING_TYPES } from './PricingScheme.js'
const models = {
    ...imageModels,
    ...videoModels
}

// Convert USD price to database format (multiply by 10000 to get 4 decimal places)
export function convertPriceToDbFormat(usdPrice) {
    return Math.ceil(usdPrice * 10000)
}

// Pre-calculate the price for the model. This is used to deduct credits before the image is generated.
// If the price cannot be calculated before image generation, return the max price.
export function preCalcPrice(params, providerIndex) {
    const modelConfig = models[params.model]
    const pricing = modelConfig.providers[providerIndex].pricing

    switch (pricing.type) {
        case PRICING_TYPES.FIXED:
            return pricing.value
        case PRICING_TYPES.CALCULATED:
            return pricing.calcFunction(params)
        case PRICING_TYPES.POST_GENERATION:
            return pricing.range?.max ?? pricing.value
        default:
            throw new Error('Invalid price format for model ' + modelConfig.name + ', please contact support')
    }
}

// Post-calculate the price for models that cannot be estimated before image generation.
export function postCalcPrice(params, imageResult, providerIndex) {
    const modelConfig = models[params.model]
    const pricing = modelConfig.providers[providerIndex].pricing

    if (pricing.type === PRICING_TYPES.POST_GENERATION) {
        return pricing.postCalcFunction(imageResult, params)
    }

    // Default to pre-calculated price
    return preCalcPrice(params, providerIndex)
}
