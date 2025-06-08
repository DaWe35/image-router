import { imageModels } from '../shared/imageModels/index.js'

// Validate the parameters for the image generation request and return only the valid parameters
export function validateImageParams(req) {
    const { prompt, model, response_format, size, quality } = req.body
    const files = req.files || {}

    if (!prompt) throw new Error("'prompt' is a required parameter")
    if (!model) throw new Error("'model' is a required parameter")

    // Validate model parameter and config
    const modelConfig = imageModels[model]
    if (!modelConfig) throw new Error("model '" + model + "' is not available")
    if (!modelConfig?.providers[0].id) throw new Error("model provider for '" + model + "' is not available")

    // Set default response_format and validate
    const validResponseFormat = response_format || 'url'
    if (!['url', 'b64_json'].includes(validResponseFormat)) {
        throw new Error("'response_format' must be either 'url' or 'b64_json'")
    }
    if (size) {
        throw new Error("'size' is not yet supported.")
    }
    // Validate quality parameter. Can be low, medium, high.
    let qualityLower
    if (quality) {
        qualityLower = quality.toLowerCase()
        const allowedQualities = ['auto', 'low', 'medium', 'high']
        if (!allowedQualities.includes(qualityLower)) {
            throw new Error(`'quality' must be one of: ${allowedQualities.join(', ')}`)
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

    return { prompt, model, response_format: validResponseFormat, quality: qualityLower, files: validFiles }
}
