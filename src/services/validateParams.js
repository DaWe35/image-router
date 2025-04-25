import { imageModels } from '../shared/common.js'

export const validateParams = (req) => {
    const { prompt, model, response_format } = req.body

    if (!prompt) {
        return "'prompt' is a required parameter"
    }

    if (!model) {
        return "'model' is a required parameter"
    }

    // Validate model parameter and config
    const modelConfig = imageModels[model]
    if (!modelConfig) {
        return "model '" + model + "' is not available"
    }

    if (!modelConfig?.providers[0]) {
        return "model provider for '" + model + "' is not available"
    }

    const maxPriceUsd = estimateMaxPrice(modelConfig)
    if (typeof maxPriceUsd !== 'number') {
        return 'Model price is not configured properly.'
    }
    

    // Validate response_format parameter
    if (response_format && response_format !== 'b64_json' && response_format !== 'url') {
        return "'response_format' must be 'b64_json' or 'url'"
    }


    return null
}