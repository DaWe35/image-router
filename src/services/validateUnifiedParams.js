import { imageModels } from '../shared/imageModels/index.js'
import { videoModels } from '../shared/videoModels/index.js'

/**
 * Validate unified API parameters following Open Responses spec
 */
export function validateUnifiedParams(req) {
    const { model, messages, max_items, modalities, stream, ...rest } = req.body

    // Validate required fields
    if (!model) {
        throw new Error('model is required')
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        throw new Error('messages must be a non-empty array')
    }

    // Check if model exists
    const allModels = { ...imageModels, ...videoModels }
    if (!allModels[model]) {
        throw new Error(`The model '${model}' does not exist.`)
    }

    // Validate messages structure
    for (const message of messages) {
        if (!message.role) {
            throw new Error('Each message must have a role')
        }
        if (!message.content) {
            throw new Error('Each message must have content')
        }
    }

    // Extract prompt and files from messages
    let prompt = ''
    let imageDataUrls = []
    let videoDataUrls = []
    const files = {}

    const lastMessage = messages[messages.length - 1]
    
    if (typeof lastMessage.content === 'string') {
        prompt = lastMessage.content
    } else if (Array.isArray(lastMessage.content)) {
        for (const item of lastMessage.content) {
            if (item.type === 'text' && item.text) {
                prompt += (prompt ? '\n' : '') + item.text
            } else if (item.type === 'image_url' && item.image_url?.url) {
                imageDataUrls.push(item.image_url.url)
            } else if (item.type === 'video_url' && item.video_url?.url) {
                videoDataUrls.push(item.video_url.url)
            }
        }
    }

    if (!prompt && imageDataUrls.length === 0 && videoDataUrls.length === 0) {
        throw new Error('Message content must contain at least text or media')
    }

    // Handle uploaded files from multipart
    if (req.files) {
        if (req.files.image) {
            files.image = req.files.image
        }
        if (req.files.video) {
            files.video = req.files.video
        }
        if (req.files.mask) {
            files.mask = req.files.mask
        }
    }

    // Build params object compatible with internal format
    const params = {
        model,
        prompt,
        n: max_items || 1,
        files,
        ...rest
    }

    // Handle legacy fields that might be in rest
    // Common fields: size, quality, response_format, seconds, etc.
    
    return params
}
