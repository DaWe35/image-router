// Convert USD price to database format (multiply by 10000 to get 4 decimal places)
export function convertPriceToDbFormat(usdPrice) {
    return Math.round(usdPrice * 10000)
}

export function estimateMaxPrice(modelConfig) {
    if (modelConfig.price === 'dynamic') {
        return modelConfig.priceExamples.max
    }
    return modelConfig.price
}

export function calculateDynamicPrice(modelName, response) {
    if (modelName === 'openai/gpt-image-1') {
        // TODO: Calculate price based on response
        return modelConfig.priceExamples.average
    }
    return modelConfig.price
}
