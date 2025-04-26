import { imageModels } from '../shared/common.js'

export function validateParams(req) {
    const { prompt, model, response_format, size, quality } = req.body

    if (!prompt) throw new Error("'prompt' is a required parameter")
    if (!model) throw new Error("'model' is a required parameter")

    // Validate model parameter and config
    const modelConfig = imageModels[model]
    if (!modelConfig) throw new Error("model '" + model + "' is not available")
    if (!modelConfig?.providers[0]) throw new Error("model provider for '" + model + "' is not available")

    // Validate response_format parameter
    if (response_format) {
        throw new Error("'response_format' is not yet supported. Depending on the model, you'll get a base64 encoded image or a url to the image, but it cannot be changed now.")
    }
    // Validate size parameter
    const newSize = getSize(model, size)
    const newQuality = getQuality(model, quality)

    return {prompt, model, newSize, newQuality}
}

export function getSize(model, size) {
    if (!size) return imageModels[model].parameters.size.default
    
    const validSizes = imageModels[model].parameters.size.values
    if (validSizes.includes(size)) {
        return size
    }
        
    throw new Error(`Invalid size parameter '${size}', valid sizes are: ${validSizes.join(", ")}`)
}

export function getQuality(model, quality) {
    if (!quality) return imageModels[model].parameters.quality.default
    
    const qualityParams = imageModels[model].parameters.quality
    const validQualities = qualityParams?.values || []
    const synonyms = qualityParams?.synonyms || {}
    const range = qualityParams?.range || {}
    
    // Check if quality is in valid values list
    if (validQualities.includes(quality)) {
        return quality
    }
    
    // Check if quality is a synonym
    if (synonyms[quality]) {
        return synonyms[quality]
    }
    
    // Check if quality is a number within the range
    const qualityNum = Number(quality)
    if (!isNaN(qualityNum) && 
        range.min !== undefined && 
        range.max !== undefined && 
        qualityNum >= range.min && 
        qualityNum <= range.max) {
        return qualityNum
    }
    
    // If we got here, the quality value is invalid
    throw new Error(`Invalid quality parameter '${quality}'. Valid options are: ${validQualities.join(", ")}, ${Object.keys(synonyms).join(", ")}, or a number between ${range.min} and ${range.max}`)
}