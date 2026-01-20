import { generateImage } from './imageService.js'
import { generateVideo } from './videoService.js'
import { imageModels } from '../shared/imageModels/index.js'
import { videoModels } from '../shared/videoModels/index.js'

/**
 * Unified generation service following Open Responses spec
 * Handles text, image, video, and audio generation through a single interface
 */
export async function generateUnified(fetchParams, userId, res, usageLogId, providerIndex) {
    const startTime = Date.now()
    const modelConfig = { ...imageModels, ...videoModels }[fetchParams.model]
    
    if (!modelConfig) {
        throw new Error('Invalid model specified')
    }

    // Determine modality from model config
    const modelOutputType = modelConfig.output?.[0] || 'image'
    
    let result
    
    switch (modelOutputType) {
        case 'image':
            result = await generateImage(fetchParams, userId, res, usageLogId, providerIndex)
            break
        case 'video':
            result = await generateVideo(fetchParams, userId, res, usageLogId, providerIndex)
            break
        case 'audio':
            // Future: audio generation
            throw new Error('Audio generation not yet supported')
        case 'text':
            // Future: text generation
            throw new Error('Text generation not yet supported')
        default:
            throw new Error(`Unsupported output type: ${modelOutputType}`)
    }

    result.latency = Date.now() - startTime
    return result
}

/**
 * Convert Open Responses format to internal format
 */
export function convertOpenResponsesToInternal(openResponsesBody) {
    const { model, messages, max_items = 1, modalities, ...rest } = openResponsesBody
    
    // Extract prompt from last user message
    let prompt = ''
    let imageFiles = []
    let videoFiles = []
    let audioFiles = []
    
    if (messages && messages.length > 0) {
        const lastMessage = messages[messages.length - 1]
        
        if (typeof lastMessage.content === 'string') {
            prompt = lastMessage.content
        } else if (Array.isArray(lastMessage.content)) {
            // Handle multimodal content
            for (const item of lastMessage.content) {
                if (item.type === 'text' && item.text) {
                    prompt += (prompt ? '\n' : '') + item.text
                } else if (item.type === 'image_url' && item.image_url?.url) {
                    imageFiles.push(item.image_url.url)
                } else if (item.type === 'video_url' && item.video_url?.url) {
                    videoFiles.push(item.video_url.url)
                } else if (item.type === 'audio_url' && item.audio_url?.url) {
                    audioFiles.push(item.audio_url.url)
                }
            }
        }
    }

    const internalParams = {
        model,
        prompt,
        n: max_items,
        ...rest
    }

    // Attach files if present
    if (imageFiles.length > 0) {
        internalParams.files = { image: imageFiles }
    }

    return internalParams
}

/**
 * Convert internal format to Open Responses format
 */
export function convertInternalToOpenResponses(internalResult, model) {
    const { data, created, cost, latency, ...rest } = internalResult
    
    if (!data || !Array.isArray(data)) {
        throw new Error('Invalid internal result format')
    }

    // Determine output type from result
    const items = data.map((item, index) => {
        const responseItem = {
            id: `item_${Date.now()}_${index}`,
            type: 'message',
            role: 'assistant',
            content: []
        }

        // Handle different output formats
        if (item.url) {
            // Determine type from URL or context
            if (item.url.match(/\.(mp4|webm|mov)$/i) || model.includes('video') || model.includes('veo') || model.includes('kling')) {
                responseItem.content.push({
                    type: 'video_url',
                    video_url: {
                        url: item.url
                    }
                })
            } else if (item.url.match(/\.(mp3|wav|ogg)$/i) || model.includes('audio')) {
                responseItem.content.push({
                    type: 'audio_url',
                    audio_url: {
                        url: item.url
                    }
                })
            } else {
                // Default to image
                responseItem.content.push({
                    type: 'image_url',
                    image_url: {
                        url: item.url
                    }
                })
            }
        } else if (item.b64_json) {
            // Determine type from model or default to image
            let mimeType = 'image/png'
            let contentType = 'image_url'
            
            if (model.includes('video') || model.includes('veo') || model.includes('kling')) {
                mimeType = 'video/mp4'
                contentType = 'video_url'
            } else if (model.includes('audio')) {
                mimeType = 'audio/mpeg'
                contentType = 'audio_url'
            }
            
            const dataUrl = item.b64_json.startsWith('data:') 
                ? item.b64_json 
                : `data:${mimeType};base64,${item.b64_json}`
            
            if (contentType === 'video_url') {
                responseItem.content.push({
                    type: 'video_url',
                    video_url: {
                        url: dataUrl
                    }
                })
            } else if (contentType === 'audio_url') {
                responseItem.content.push({
                    type: 'audio_url',
                    audio_url: {
                        url: dataUrl
                    }
                })
            } else {
                responseItem.content.push({
                    type: 'image_url',
                    image_url: {
                        url: dataUrl
                    }
                })
            }
        } else if (item.text) {
            responseItem.content.push({
                type: 'text',
                text: item.text
            })
        }

        return responseItem
    })

    const response = {
        id: `resp_${Date.now()}`,
        object: 'response',
        created: created || Math.floor(Date.now() / 1000),
        model,
        items,
        usage: {
            total_cost: cost || 0
        }
    }

    if (latency) {
        response.usage.latency_ms = latency
    }

    return response
}
