import { models } from '../shared/models/index.js'

// Validate the parameters for the image generation request and return only the valid parameters
export function validateParams(req) {
    const { prompt, model, response_format, size, quality } = req.body
    const files = req.files || {}

    if (!prompt) throw new Error("'prompt' is a required parameter")
    if (!model) throw new Error("'model' is a required parameter")

    // Validate model parameter and config
    const modelConfig = models[model]
    if (!modelConfig) throw new Error("model '" + model + "' is not available")
    if (!modelConfig?.providers[0].id) throw new Error("model provider for '" + model + "' is not available")

    // Validate response_format parameter
    if (response_format) {
        throw new Error("'response_format' is not yet supported. Depending on the model, you'll get a base64 encoded image or a url to the image, but it cannot be changed now.")
    }
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
    
    // Initialize validFiles object
    let validFiles = {}
    
    // Validate image parameter - can be multiple images (up to 16)
    if (files.image) {
        validFiles.image = files.image
        // Ensure we don't exceed the maximum number of images
        if (Array.isArray(validFiles.image) && validFiles.image.length > 16) {
            throw new Error("Maximum of 16 images can be uploaded")
        }
    }
    
    // Validate mask parameter
    if (files.mask) {
        validFiles.mask = files.mask
    }

    return { prompt, model, quality: qualityLower, files: validFiles }
}
