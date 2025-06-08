import { videoModels } from '../shared/videoModels/index.js'

// Validate the parameters for the video generation request and return only the valid parameters
export function validateVideoParams(req) {
    const { prompt, model, response_format, size, quality } = req.body

    if (!prompt) throw new Error("'prompt' is a required parameter")
    if (!model) throw new Error("'model' is a required parameter")

    // Validate model parameter and config
    const modelConfig = videoModels[model]
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
    
    
    if (quality) {
        throw new Error("'quality' is not yet supported.")
    }

    return { prompt, model, response_format: validResponseFormat }
} 