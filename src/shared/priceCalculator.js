import { imageModels } from './common.js'

// Convert USD price to database format (multiply by 10000 to get 4 decimal places)
export function convertPriceToDbFormat(usdPrice) {
    return Math.ceil(usdPrice * 10000)
}

// Pre-calculate the price for the model. This is used to deduct credits before the image is generated.
// If the price cannot be calculated before image generation, return the max price.
export function preCalcPrice(modelName, size, quality) {
    const modelConfig = imageModels[modelName]

    switch (modelName) {
        case 'openai/dall-e-2':
            return calcDallE_2(size, quality)
        case 'openai/dall-e-3':
            return calcDallE_3(size, quality)
        case 'openai/gpt-image-1':
            return modelConfig.priceExamples.max
        default:
            if (typeof modelConfig.price === 'number') {
                return modelConfig.price
            } else {
                throw new Error('Invalid price format for model ' + modelConfig.name + ', please contact support')
            }
    }
}

// Post-calculate the price for models that cannot be estimated before image generation.
export function postCalcPrice(modelName, imageResult) {
    const modelConfig = imageModels[modelName]
    
    // Calculate price for GPT-Image-1 after the image is generated and refund the difference
    if (modelName === 'openai/gpt-image-1') {
        const inputTextPrice = 0.000005
        const inputImagePrice = 0.00001
        const outputImagePrice = 0.00004

        const inputTextTokens = imageResult.usage.input_tokens_details.text_tokens
        const inputImageTokens = imageResult.usage.input_tokens_details.image_tokens
        const outputImageTokens = imageResult.usage.output_tokens

        const totalPrice = inputTextPrice * inputTextTokens + inputImagePrice * inputImageTokens + outputImagePrice * outputImageTokens
        return totalPrice
    }

    // return the pre-calculated price as default
    return preCalcPrice(modelConfig)
}



// Calculate price for dynamic models
export function calcDallE_2(size, quality) {
    if (quality != 'standard') {
        throw new Error('Quality must be "standard" for Dall-E 2')
    }
    if (size === '1024x1024') {
        return 0.02
    } else if (size === '512x512') {
        return 0.018
    } else if (size === '256x256') {
        return 0.016
    } else {
        throw new Error('Invalid size for Dall-E 2')
    }
}

export function calcDallE_3(size, quality) {
    if (quality === 'standard') {
        switch (size) {
            case '1024x1024':
                return 0.04
            case '1024x1792':
            case '1792x1024':
                return 0.08
        }
    } else if (quality === 'hd') {
        switch (size) {
            case '1024x1024':
                return 0.08
            case '1024x1792':
            case '1792x1024':
                return 0.12
        }
    }
    throw new Error('Invalid quality for Dall-E 3')
}