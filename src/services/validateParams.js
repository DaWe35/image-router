import { models } from '../shared/models/index.js'

export function validateParams(req) {
    const { prompt, model, response_format, size, quality, image, mask } = req.body

    if (!prompt) throw new Error("'prompt' is a required parameter")
    if (!model) throw new Error("'model' is a required parameter")

    // Validate model parameter and config
    const modelConfig = models[model]
    if (!modelConfig) throw new Error("model '" + model + "' is not available")
    if (!modelConfig?.providers[0].id) throw new Error("model provider for '" + model + "' is not available")

    // Validate response_format parameter
    if (response_format) {
        throw new Error("'response_format' is not yet supported. Depending on the model, you'll get a base64 encoded image or a url to the image, but it cannot be changed now.")
    }    // Validate response_format parameter
    if (size) {
        throw new Error("'size' is not yet supported.")
    }
    // Validate quality parameter. Can be low, medium, high.
    let qualityLower
    if (quality) {
        qualityLower = quality.toLowerCase()
        if (qualityLower !== 'auto' && qualityLower !== 'low' && qualityLower !== 'medium' && qualityLower   !== 'high') {
            throw new Error("'quality' must be 'auto', 'low', 'medium', or 'high'")
        }
    }

    // Validate image parameter
    let validatedImage
    if (image) {
        validatedImage = image
    }
    
    // Validate mask parameter
    let validatedMask
    if (mask) {
        validatedMask = mask
    }

    return { prompt, model, quality: qualityLower, image: validatedImage, mask: validatedMask }
}
