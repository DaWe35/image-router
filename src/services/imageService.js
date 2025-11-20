import fs from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'
import pkg from 'https-proxy-agent'
const { HttpsProxyAgent } = pkg
import { imageModels } from '../shared/imageModels/index.js'
import { objectToFormData, getGeminiApiKey, extractWidthHeight, calculateRunwareDimensions } from './imageHelpers.js'
import { storageService } from './storageService.js'
import { pollReplicatePrediction } from './replicateUtils.js'
import { selectProvider } from '../utils/providerSelector.js'

// Gemini size mappings - shared between generateGemini and generateVertexGemini
const sizeToAspectRatio = {
    // Gemini 2.5 Flash sizes
    '1024x1024': '1:1',
    '832x1248': '2:3',
    '1248x832': '3:2',
    '864x1184': '3:4',
    '1184x864': '4:3',
    '896x1152': '4:5',
    '1152x896': '5:4',
    '768x1344': '9:16',
    '1344x768': '16:9',
    '1536x672': '21:9',
    // Gemini 3 Pro 1K sizes
    '848x1264': '2:3',
    '1264x848': '3:2',
    '896x1200': '3:4',
    '1200x896': '4:3',
    '928x1152': '4:5',
    '1152x928': '5:4',
    '768x1376': '9:16',
    '1376x768': '16:9',
    '1584x672': '21:9',
    // Gemini 3 Pro 2K sizes
    '2048x2048': '1:1',
    '1696x2528': '2:3',
    '2528x1696': '3:2',
    '1792x2400': '3:4',
    '2400x1792': '4:3',
    '1856x2304': '4:5',
    '2304x1856': '5:4',
    '1536x2752': '9:16',
    '2752x1536': '16:9',
    '3168x1344': '21:9',
    // Gemini 3 Pro 4K sizes
    '4096x4096': '1:1',
    '3392x5056': '2:3',
    '5056x3392': '3:2',
    '3584x4800': '3:4',
    '4800x3584': '4:3',
    '3712x4608': '4:5',
    '4608x3712': '5:4',
    '3072x5504': '9:16',
    '5504x3072': '16:9',
    '6336x2688': '21:9',
};

// Map size to imageSize for Gemini 3 Pro (1K, 2K, 4K)
const sizeToImageSize = {
    // 1K resolution
    '1024x1024': '1K',
    '848x1264': '1K',
    '1264x848': '1K',
    '896x1200': '1K',
    '1200x896': '1K',
    '928x1152': '1K',
    '1152x928': '1K',
    '768x1376': '1K',
    '1376x768': '1K',
    '1584x672': '1K',
    // 2K resolution
    '2048x2048': '2K',
    '1696x2528': '2K',
    '2528x1696': '2K',
    '1792x2400': '2K',
    '2400x1792': '2K',
    '1856x2304': '2K',
    '2304x1856': '2K',
    '1536x2752': '2K',
    '2752x1536': '2K',
    '3168x1344': '2K',
    // 4K resolution
    '4096x4096': '4K',
    '3392x5056': '4K',
    '5056x3392': '4K',
    '3584x4800': '4K',
    '4800x3584': '4K',
    '3712x4608': '4K',
    '4608x3712': '4K',
    '3072x5504': '4K',
    '5504x3072': '4K',
    '6336x2688': '4K',
};

export async function generateImage(fetchParams, userId, res, usageLogId, providerIndex) {
    const startTime = Date.now()
    const modelConfig = imageModels[fetchParams.model]
    const selectedProvider = modelConfig.providers[providerIndex]

    if (!selectedProvider) {
        throw new Error('Invalid model specified')
    }

    // Get alias model if available
    fetchParams.model = selectedProvider.model_name

    // Apply image editing if available
    if (fetchParams.files.image) {
        if (typeof selectedProvider?.applyImage === 'function') {
            fetchParams = await selectedProvider.applyImage(fetchParams)
        } else {
            const supportedModels = Object.keys(imageModels).filter(modelId => 
                imageModels[modelId].supported_params?.edit === true
            )
            throw new Error(`This model does not support image inputs`)
        }
    }

    // Apply mask editing if available
    if (fetchParams.files.mask) {
        if (typeof selectedProvider?.applyMask === 'function') {
            fetchParams = await selectedProvider.applyMask(fetchParams)
        } else {
            throw new Error('Mask editing is not supported for this model')
        }
    }
    delete fetchParams.files

    // Apply quality if available and a function is defined. This can change the model to use, or any other variables!
    if (fetchParams.quality && typeof selectedProvider?.applyQuality === 'function') {
        fetchParams = selectedProvider.applyQuality(fetchParams)
    }


    const providerHandlers = {
      chutes: generateChutes,
      deepinfra: generateDeepInfra,
      fal: generateFal,
      grok: generateGrok,
      gemini: generateGemini,
      geminiImagen: generateGeminiImagen,
      openrouter: generateOpenRouter,
      openai: generateOpenAI,
      nanogpt: generateNanoGPT,
      replicate: generateReplicate,
      runware: generateRunware,
      wavespeed: generateWavespeed,
      test: generateTest,
      vertex: generateVertex
    }

    const handler = providerHandlers[selectedProvider.id]
    if (!handler) {
      throw new Error(`No handler implemented for provider ${selectedProvider.id}`)
    }

    let intervalId
    if (res) {
      res.setHeader('Content-Type', 'application/json')
      res.flushHeaders()
      const heartbeatInterval = 3000 // 3 seconds
      intervalId = setInterval(() => {
        res.write(' ')
      }, heartbeatInterval)

      // Clean up the heartbeat timer if the client disconnects early
      res.on('close', () => {
        if (intervalId) clearInterval(intervalId)
      })
    }

    try {
      const result = await handler({ fetchParams, userId, usageLogId })
      result.latency = Date.now() - startTime
      if (intervalId) clearInterval(intervalId)
      
      // Skip storage processing for test models
      if (fetchParams.model.includes('test')) {
        return result
      }
      
      // Process result through storage service
      const processedResult = await storageService.processImageResult(result, userId, fetchParams.response_format, usageLogId)
      return processedResult
    } catch (error) {
      if (intervalId) clearInterval(intervalId)
      throw error
    }
}
// xAI Grok Images API call
async function generateGrok({ fetchParams, userId }) {
    const providerUrl = 'https://api.x.ai/v1/images/generations'
    const providerKey = process.env.XAI_API_KEY

    if (!providerKey) {
        throw new Error('XAI_API_KEY environment variable is required for xAI provider')
    }

    const body = {
        model: fetchParams.model,
        prompt: fetchParams.prompt
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${providerKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
        throw {
            status: response.status,
            errorResponse: data
        }
    }
    
    return data
}

// OpenAI format API call
async function generateOpenAI({ fetchParams, userId }) {
    // Detect if this is an edit request
    const isEdit = Boolean(fetchParams.image)
    const providerUrl = isEdit ? 'https://api.openai.com/v1/images/edits' : 'https://api.openai.com/v1/images/generations'
    const providerKey = process.env.OPENAI_API_KEY

    if ((fetchParams.model === 'dall-e-3' || fetchParams.model === 'dall-e-2') && fetchParams.size === 'auto') {
        fetchParams.size = '1024x1024'
    }
    
    // Set up basic parameters
    let fetchBody = {
        prompt: fetchParams.prompt,
        model: fetchParams.model,
        quality: fetchParams.quality,
        size: fetchParams.size,
        user: userId,
        n: 1,
    }
    if (fetchParams.model === 'gpt-image-1') fetchBody.moderation = 'low'
    if (isEdit) {
        fetchBody.image = fetchParams.image
        fetchBody.mask = fetchParams.mask
    }

    const headers = {
        'Authorization': `Bearer ${providerKey}`
    }
    
    // Don't set Content-Type for multipart form data when using fetch with FormData
    // The browser/runtime will set it automatically with the correct boundary

    const body = isEdit ? objectToFormData(fetchBody) : JSON.stringify(fetchBody)
    
    if (!isEdit) {
        headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers,
        body
    })

    if (!response.ok) {
        const errorResponse = await response.json()
        throw {
            status: response.status,
            errorResponse: errorResponse
        }
    }

    const data = await response.json()
    return data
}

// OpenAI format API call
async function generateNanoGPT({ fetchParams, userId }) {
    const providerUrl = 'https://nano-gpt.com/v1/images/generations'
    const providerKey = process.env.NANO_GPT_API_KEY
    
    // Set up basic parameters
    let fetchBody = {
        prompt: fetchParams.prompt,
        model: fetchParams.model,
        quality: fetchParams.quality,
        user: userId,
        n: 1,
    }

    if (fetchParams.image) {
        if (Array.isArray(fetchParams.image) && fetchParams.image.length > 1) {
            fetchBody.imageDataUrls = fetchParams.image
        } else if (Array.isArray(fetchParams.image) && fetchParams.image.length === 1) {
            fetchBody.imageDataUrl = fetchParams.image[0]
        } else {
            fetchBody.imageDataUrl = fetchParams.image
        }
    }

    const headers = {
        'Authorization': `Bearer ${providerKey}`,
        'Content-Type': 'application/json'
    }
    
    const response = await fetch(providerUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(fetchBody)
    })

    if (!response.ok) {
        const errorResponse = await response.json()
        return {
            error: errorResponse.error,
            cost: errorResponse?.cost
        }
    }

    const data = await response.json()

    // If this is an async Midjourney task, we need to poll for the result
    if (data.task_id && data.status === 'submitted') {
        const statusCheckUrl = 'https://nano-gpt.com/api/check-midjourney-status'
        const maxAttempts = 120 // ~10 minutes @ 5s interval
        const delay = 5000
        let attempts = 0
        let lastStatusPayload = data

        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, delay))

            const pollRes = await fetch(statusCheckUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': providerKey
                },
                body: JSON.stringify({ task_id: data.task_id })
            })

            lastStatusPayload = await pollRes.json()

            if (!pollRes.ok) {
                console.error("NanoGPT polling error: " + JSON.stringify(lastStatusPayload))
            }
            
            if (lastStatusPayload.status === 'SUCCESS') {
                return {
                    created: Math.floor(Date.now() / 1000),
                    data: [{
                        url: lastStatusPayload.imageUrl,
                        revised_prompt: null,
                    }],
                    cost: data.cost,
                }
            }

            if (lastStatusPayload.status === 'FAILED') {
                return {
                    error: {
                        message: lastStatusPayload.failReason || 'Generation failed',
                        type: 'generation_failed',
                        original_response_from_provider: lastStatusPayload
                    },
                    cost: data.cost
                }
            }

            attempts++
        }

        // Timeout
        return {
            error: {
                message: 'Prediction timed out on Midjourney – please try again later',
                type: 'timeout_error',
                original_response_from_provider: lastStatusPayload
            },
            cost: data.cost
        }
    }

    return data
}

// OpenAI format API call
async function generateDeepInfra({ fetchParams, userId, usageLogId }) {
    const providerUrl = 'https://api.deepinfra.com/v1/inference/' + fetchParams.model
    const providerKey = process.env.DEEPINFRA_API_KEY

    // Check if this is an image input request (e.g., background removal)
    const hasImage = Boolean(fetchParams.image)

    let body
    const headers = {
        'Authorization': `Bearer ${providerKey}`
    }

    if (hasImage) {
        // Use FormData for image inputs
        body = objectToFormData({
            image: fetchParams.image,
            prompt: fetchParams.prompt,
        })
        // Don't set Content-Type for FormData - it will be set automatically with boundary
    } else {
        // Use JSON for text-to-image generation
        const bodyObj = {
            prompt: fetchParams.prompt,
            num_images: 1,
        }

        const { width, height } = extractWidthHeight(fetchParams.size)
        if (width) bodyObj.width = width
        if (height) bodyObj.height = height

        if (fetchParams.num_inference_steps) bodyObj.num_inference_steps = fetchParams.num_inference_steps
        if (fetchParams.steps) bodyObj.steps = fetchParams.steps

        body = JSON.stringify(bodyObj)
        headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers,
        body
    })

    if (!response.ok) {
        const errorResponse = await response.json()

        const extractedMessages = Array.isArray(errorResponse?.detail)
            ? errorResponse.detail.map(d => {
                const loc = Array.isArray(d?.loc) ? d.loc.join('.') : String(d?.loc || '')
                return loc + " " + d?.msg.toLowerCase()
            }).filter(Boolean)
            : []

        const formattedError = {
            status: errorResponse?.status || response.status || 500,
            statusText: errorResponse?.statusText || response.statusText || 'Unknown Error',
            error: {
                message: extractedMessages.join('; ') || errorResponse?.message || 'An unknown error occurred',
                type: errorResponse?.detail?.[0]?.type || 'Unknown Error'
            },
            original_response_from_provider: errorResponse
        }
        throw {
            status: response.status,
            errorResponse: formattedError
        }
    }

    const data = await response.json()

    if (data.status === 'request_moderated') {
        throw {
            status: 406,
            errorResponse: {
                status: 406,
                statusText: 'Request was moderated',
                error: {
                    message: 'Request was moderated',
                    type: 'request_moderated'
                },
                original_response_from_provider: data
            }
        }
    }

    return {
        created: Math.floor(Date.now() / 1000),
        data: (() => {
            if (Array.isArray(data.images)) {
                return data.images.map(image => {
                    // Check if the image is a URL (new behavior) or base64 (old behavior)
                    if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
                        return {
                            url: image,
                            revised_prompt: null,
                        }
                    }
                    return {
                        b64_json: image,
                        revised_prompt: null,
                    }
                })
            }
            if (Array.isArray(data.image_urls)) {
                return data.image_urls.map(url => ({
                    url,
                    revised_prompt: null,
                }))
            }
            if (data.image_url) {
                return [{
                    url: data.image_url,
                    revised_prompt: null,
                }]
            }
            return []
        })(),
        cost: data.inference_status?.cost
    }
}

// Replicate format API call
async function generateReplicate({ fetchParams, userId, usageLogId }) {
    const providerUrl = `https://api.replicate.com/v1/models/${fetchParams.model}/predictions`
    const providerKey = process.env.REPLICATE_API_KEY

    // Build the input object starting with the prompt
    const input = {
        prompt: fetchParams.prompt
    }

    // Add image if available
    if (fetchParams.image) {
        input.image = fetchParams.image
    }
    
    if (fetchParams.reference_images) {
        input.reference_images = fetchParams.reference_images
    }

    const createRes = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Prefer': 'wait',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        body: JSON.stringify({ input })
    })

    let data = await createRes.json()

    if (!createRes.ok) {
        const formattedError = {
            status: data?.status,
            statusText: data?.detail,
            error: {
                message: data?.detail,
                type: data?.status
            },
            original_response_from_provider: data
        }
        throw {
            status: createRes.status,
            errorResponse: formattedError
        }
    }

    // If the prediction is still running, poll until it finishes
    if (data.status !== 'succeeded' || !data.output) {
        data = await pollReplicatePrediction(data.urls.get, providerKey)
    }

    // Handle timeout without throwing so credits are not fully refunded
    if (data.status === 'timeout' || !data.output) {
        return {
            error: {
                message: 'Prediction timed out on Replicate – please try again later',
                type: 'timeout_error',
                original_response_from_provider: data
            }
        }
    }

    // Ensure output is in array form
    const outputArray = Array.isArray(data.output) ? data.output : [data.output]

    return {
        created: Math.floor(new Date(data.created_at).getTime() / 1000),
        data: outputArray.map(url => ({
            url,
            revised_prompt: null,
            original_response_from_provider: data
        }))
    }
}


async function generateGemini({ fetchParams, userId, usageLogId }) {
    const providerKey = getGeminiApiKey(fetchParams.model)
    
    const providerUrl = `https://generativelanguage.googleapis.com/v1beta/models/${fetchParams.model}:generateContent?key=${providerKey}`

    // Get webshare proxy credentials from environment variables
    const proxyUrl = process.env.PROXY_URL

    // Create proxy agent if all proxy credentials are available
    let agent = null
    if (proxyUrl) {
        agent = new HttpsProxyAgent(proxyUrl)
    }

    const parts = [{"text": fetchParams.prompt}]
    
    // Image Edits
    if (fetchParams.imagesData && fetchParams.imagesData.length > 0) {
        for (const imageData of fetchParams.imagesData) {
            const arrayBuffer = await imageData.blob.arrayBuffer()
            const base64Data = Buffer.from(arrayBuffer).toString('base64')
            parts.push({
                "inline_data": {
                    "mime_type": imageData.blob.type,
                    "data": base64Data
                }
            })
        }
    }

    const generationConfig = {
        responseModalities: ["Text", "Image"],
    };

    if (fetchParams.size) {
        const aspectRatio = sizeToAspectRatio[fetchParams.size];
        if (aspectRatio) {
            generationConfig.imageConfig = {
                aspectRatio: aspectRatio
            };
            
            // For Gemini 3 Pro, also add imageSize
            if (fetchParams.model === 'gemini-3-pro-image-preview') {
                const imageSize = sizeToImageSize[fetchParams.size];
                if (imageSize) {
                    generationConfig.imageConfig.imageSize = imageSize;
                }
            }
        }
    }

    const body = {
        "contents": [{
            "parts": parts
        }],
        "generationConfig": generationConfig
    };

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        agent
    })

    // Safely parse body (fallback to text for non-JSON errors)
    const rawBody = await response.text()
    let data
    try {
        data = rawBody ? JSON.parse(rawBody) : null
    } catch (_) {
        data = null
    }

    if (!response.ok) {
        const formattedError = {
            status: data?.error?.code || response.status,
            statusText: data?.error?.status || response.statusText,
            error: {
                message: data?.error?.message || (rawBody || 'Request failed'),
                type: data?.error?.status || 'Unknown Error'
            },
            original_response_from_provider: data ?? rawBody
        }
        if (formattedError?.statusText === 'RESOURCE_EXHAUSTED' && fetchParams.model === 'gemini-2.0-flash-exp-image-generation') {
            formattedError.error.message = 'This model hit a global rate limit. Please try again.'
        }
        throw {
            status: response.status,
            errorResponse: formattedError
        }
    }

    if (!data) {
        throw {
            status: 502,
            errorResponse: {
                status: 502,
                statusText: 'Invalid JSON response from provider',
                error: {
                    message: 'Provider returned a non-JSON success response',
                    type: 'invalid_response'
                },
                original_response_from_provider: rawBody
            }
        }
    }
    
    // Find all image data in the response parts
    const imageDataArray = []
    if (data?.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
            if (part?.inlineData?.data) {
                imageDataArray.push(part.inlineData.data)
            }
        }
    }

    if (imageDataArray.length > 0) {
        return {
            created: Math.floor(new Date().getTime() / 1000),
            data: imageDataArray.map(imageData => ({
                b64_json: imageData,
                revised_prompt: null,
            }))
        }
    } else {
        // Try to find text response in the parts
        let textResponse = null
        if (data?.candidates?.[0]?.content?.parts) {
            for (const part of data.candidates[0].content.parts) {
                if (part?.text) {
                    textResponse = part.text
                    break
                }
            }
        }

        throw {
            status: 406,
            errorResponse: {
                status: 406,
                statusText: 'No image generated',
                error: {
                    message: textResponse || 'No image or text found in response',
                    type: 'No image generated'
                },
                original_response_from_provider: data
              }
        }
    }
}

async function generateVertexGemini({ fetchParams, userId }) {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY

    if (!projectId) {
        throw new Error('GOOGLE_CLOUD_PROJECT_ID environment variable is required for Vertex AI')
    }

    if (!serviceAccountKey) {
        throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is required for Vertex AI (base64 encoded service account JSON)')
    }

    // Parse the service account key
    let serviceAccount
    try {
        const keyJson = Buffer.from(serviceAccountKey, 'base64').toString('utf-8')
        serviceAccount = JSON.parse(keyJson)
    } catch (error) {
        throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_KEY format. Must be base64 encoded JSON.')
    }

    // Get access token using service account
    const { GoogleAuth } = await import('google-auth-library')
    const auth = new GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    })
    const authClient = await auth.getClient()
    const accessToken = await authClient.getAccessToken()

    if (!accessToken?.token) {
        throw new Error('Failed to get Google Cloud access token')
    }

    const providerUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${fetchParams.model}:generateContent`

    const parts = [{ text: fetchParams.prompt }]

    // Handle image inputs if they exist
    if (fetchParams.imagesData) {
        for (const imageData of fetchParams.imagesData) {
            const mimeType = imageData.startsWith('data:') ? imageData.substring(5, imageData.indexOf(';')) : 'image/png';
            const base64Data = imageData.replace(/^data:[^;]+;base64,/, '');
            parts.unshift({
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            });
        }
    }

    const requestBody = {
        contents: {
            role: "USER",
            parts: parts,
        },
        generation_config: {
            response_modalities: ["IMAGE"],
            image_config: {},
        },
        safetySettings: [
            { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_ONLY_HIGH" },
            { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_ONLY_HIGH" },
            { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_ONLY_HIGH" },
            { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "OFF" }
        ],
    };

    if (fetchParams.size) {
        const aspectRatio = sizeToAspectRatio[fetchParams.size]
        
        if (aspectRatio) {
            requestBody.generation_config.image_config.aspect_ratio = aspectRatio
            
            // For Gemini 3 Pro, also add imageSize
            if (fetchParams.model === 'gemini-3-pro-image-preview') {
                const imageSize = sizeToImageSize[fetchParams.size]
                if (imageSize) {
                    requestBody.generation_config.image_config.image_size = imageSize
                }
            }
        }
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
        const errorResponse = await response.json()
        throw {
            status: response.status,
            errorResponse
        }
    }
    
    const data = await response.json()

    // Convert Vertex AI Gemini response to our standard format
    const convertedData = {
        created: Math.floor(new Date().getTime() / 1000),
        data: [],
        original_response_from_provider: data
    }

    if (data.candidates && data.candidates.length > 0) {
        for (const candidate of data.candidates) {
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData && part.inlineData.data) {
                        convertedData.data.push({
                            revised_prompt: null,
                            b64_json: part.inlineData.data
                        });
                    }
                }
            }
        }
    }

    return convertedData
}

async function generateVertex({ fetchParams, userId }) {
    if (fetchParams.model.includes('gemini')) {
        return await generateVertexGemini({ fetchParams, userId })
    }

    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    
    if (!projectId) {
        throw new Error('GOOGLE_CLOUD_PROJECT_ID environment variable is required for Vertex AI')
    }

    if (!serviceAccountKey) {
        throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is required for Vertex AI (base64 encoded service account JSON)')
    }

    // Parse the service account key
    let serviceAccount
    try {
        const keyJson = Buffer.from(serviceAccountKey, 'base64').toString('utf-8')
        serviceAccount = JSON.parse(keyJson)
    } catch (error) {
        throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_KEY format. Must be base64 encoded JSON.')
    }

    // Get access token using service account
    const { GoogleAuth } = await import('google-auth-library')
    const auth = new GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    })
    const authClient = await auth.getClient()
    const accessToken = await authClient.getAccessToken()

    if (!accessToken?.token) {
        throw new Error('Failed to get Google Cloud access token')
    }

    const providerUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${fetchParams.model}:predict`

    const requestBody = {
        instances: [{
            prompt: fetchParams.prompt
        }],
        parameters: {
            sampleCount: 1,
            safetySetting: 'block_only_high',
        }
    }

    // Retry logic to handle transient quota-exceeded errors from Vertex AI
    const MAX_RETRIES = 10
    const RETRY_DELAY_MS = 60 * 1000 // 1 minute
    let data

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        const response = await fetch(providerUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })

        if (response.ok) {
            data = await response.json()
            break
        }

        const errorResponse = await response.json()
        const errorMessage = errorResponse?.error?.message || ''
        const quotaExceeded = errorMessage.includes('online_prediction_requests_per_base_model')

        if (quotaExceeded && attempt < MAX_RETRIES) {
            // Wait one minute before retrying
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
            continue
        }

        // Either not a quota error or retries exhausted – throw immediately
        throw {
            status: response.status,
            errorResponse
        }
    }

    // Convert Vertex AI response to our standard format
    const convertedData = {
        created: Math.floor(new Date().getTime() / 1000),
        data: []
    }

    if (data.predictions && data.predictions.length > 0) {
        convertedData.data = data.predictions.map(prediction => ({
            revised_prompt: null,
            b64_json: prediction.bytesBase64Encoded
        }))
    }

    return convertedData
}

async function generateTest({ fetchParams, userId }) {
    // Read the image file
    const imagePath = path.resolve(`src/shared/imageModels/test/${fetchParams.quality}.png`)
    const imageBuffer = await fs.readFile(imagePath)
    const b64_json = imageBuffer.toString('base64')

    // Return response based on response_format
    const responseData = {
        revised_prompt: null
    }

    if (fetchParams.response_format === 'b64_json' || fetchParams.response_format === 'b64_ephemeral') {
        responseData.b64_json = b64_json
    } else {
        responseData.url = `https://raw.githubusercontent.com/DaWe35/image-router/refs/heads/main/src/shared/imageModels/test/${fetchParams.quality}.png`
    }

    return {
        created: Date.now(),
        data: [responseData]
    }
}

// Runware REST API call
async function generateRunware({ fetchParams, userId, usageLogId }) {
    const providerUrl = 'https://api.runware.ai/v1'
    const providerKey = process.env.RUNWARE_API_KEY

    if (!providerKey) {
        throw new Error('RUNWARE_API_KEY environment variable is required for Runware provider')
    }

    // Use the APIUsage row id as task UUID to enable easier tracking across systems.
    if (!usageLogId) {
        throw new Error('usageLogId is required for Runware provider')
    }

    const taskUUID = usageLogId
    let taskType
    const upscaleModels = ['runware:500@1', 'runware:501@1', 'runware:502@1', 'runware:503@1']
    if (fetchParams.model.includes('runware:110@1')) {
        taskType = 'imageBackgroundRemoval'
    } else if (upscaleModels.includes(fetchParams.model)) {
        taskType = 'imageUpscale'
    } else {
        taskType = 'imageInference'
    }


    // Build the Runware task payload
    const taskPayload = {
        taskType,
        taskUUID,
        model: fetchParams.model,
        outputFormat: "WEBP",
        includeCost: true
    }

    if (fetchParams.steps) {
        taskPayload.steps = fetchParams.steps
    }

    // Image-to-image support

    // FLUX Kontext and Qwen Image Edit
    if (fetchParams.referenceImages) {
        taskPayload.referenceImages = Array.isArray(fetchParams.referenceImages) 
            ? fetchParams.referenceImages 
            : [fetchParams.referenceImages]
    }

    // RMBG
    if (fetchParams.inputImage) {
        taskPayload.inputImage = fetchParams.inputImage
    }
    
    // SD3
    if (fetchParams.seedImage) {
        taskPayload.seedImage = fetchParams.seedImage
        taskPayload.strength = typeof fetchParams.strength === 'number' ? fetchParams.strength : 0.8
    }
    
    // Sourceful: Riverflow
    if (fetchParams.inputs_references) {
        taskPayload.inputs = { references: fetchParams.inputs_references }
    }

    // Bria Fibo
    if (fetchParams.inputs_image) {
        taskPayload.inputs = { image: fetchParams.inputs_image }
    }

    // Inpainting support (mask)
    if (fetchParams.maskImage) {
        taskPayload.maskImage = fetchParams.maskImage
    }

    // Set positivePrompt, numberResults, and size
    if (taskType !== 'imageUpscale') {
        taskPayload.positivePrompt = fetchParams.prompt
        taskPayload.numberResults = 1

        const { width, height } = extractWidthHeight(fetchParams.size)
        const isEdit = fetchParams.referenceImages || fetchParams.inputs_references || fetchParams.inputImage || fetchParams.seedImage

        if (!isEdit) { // default 1024 for text to image, if size is not defined in model or params
            taskPayload.width = width || 1024
            taskPayload.height = height || 1024
        } else { // no default 1024 for image to image. Aspect Ratio preserved automatically.
            if (width) taskPayload.width = width
            if (height) taskPayload.height = height
        }
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        body: JSON.stringify([taskPayload])
    })

    const data = await response.json()

    if (!response.ok || !data?.data) {
        const errorObj = data?.errors?.[0] || {}
        const formattedError = {
            status: response.status,
            statusText: errorObj?.code || 'Error',
            error: {
                message: errorObj?.message || 'Runware generation failed',
                type: errorObj?.code || 'runware_error'
            },
            original_response_from_provider: data
        }
        throw {
            status: response.status,
            errorResponse: formattedError
        }
    }

    // Locate result corresponding to our taskUUID
    const taskResult = data.data.find(item => item.taskUUID === taskUUID) || data.data[0]

    const imageURL = taskResult?.imageURL || null

    return {
        created: Math.floor(Date.now() / 1000),
        data: [{
            url: imageURL,
            revised_prompt: null,
            //original_response_from_provider: data
        }],
        cost: taskResult.cost
    }
}

// Fal.ai Queue API call
async function generateFal({ fetchParams }) {
    const baseUrl = 'https://queue.fal.run'
    const providerKey = process.env.FAL_API_KEY

    if (!providerKey) {
        throw new Error('FAL_API_KEY environment variable is required for fal.ai provider')
    }

    const bodyPayload = {
        prompt: fetchParams.prompt
    }

    if (fetchParams.image_url) {
        bodyPayload.image_url = fetchParams.image_url
    }

    if (fetchParams.num_inference_steps) {
        bodyPayload.num_inference_steps = fetchParams.num_inference_steps
    }

    const submitResponse = await fetch(`${baseUrl}/${fetchParams.model}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Key ${providerKey}`
        },
        body: JSON.stringify(bodyPayload)
    })

    const submitData = await submitResponse.json()

    // Helper to pull the most descriptive error message from provider payloads
    const extractProviderMessage = (payload) => {
        if (!payload) return null
        if (typeof payload.error === 'string') return payload.error
        if (Array.isArray(payload.detail) && payload.detail.length) {
            return payload.detail.map(d => d?.msg).filter(Boolean).join('; ')
        }
        return payload.message ?? null
    }

    if (!submitResponse.ok) {
        const providerMessage = extractProviderMessage(submitData)
        throw {
            status: submitResponse.status,
            errorResponse: {
                status: submitResponse.status,
                statusText: submitResponse.statusText,
                error: {
                    message: providerMessage || 'fal.ai request failed',
                    type: 'fal_error'
                },
                original_response_from_provider: submitData
            }
        }
    }
    
    // Build helper URLs from response
    const statusUrl = submitData.status_url || `${baseUrl}/${modelPath}/requests/${submitData.request_id}/status`
    const resultUrl = submitData.response_url || `${baseUrl}/${modelPath}/requests/${submitData.request_id}`

    // Poll queue until completed
    let status = submitData.status
    const maxAttempts = 60 // ~2 minutes @ 2s interval
    const delay = 2000
    let attempts = 0
    let lastStatusPayload = submitData

    while (status !== 'COMPLETED' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay))

        const pollRes = await fetch(statusUrl + '?logs=0', {
            headers: {
                'Authorization': `Key ${providerKey}`
            }
        })

        lastStatusPayload = await pollRes.json()

        // If the polling request itself failed, return an error object (do not throw)
        if (!pollRes.ok) {
            return {
                error: {
                    message: lastStatusPayload?.error || 'Polling request failed',
                    type: 'polling_error',
                    original_response_from_provider: lastStatusPayload
                }
            }
        }

        // Early exit for failed / canceled statuses
        if (['FAILED', 'CANCELED', 'ERROR'].includes(lastStatusPayload.status)) {
            return {
                error: {
                    message: lastStatusPayload?.error || 'Generation failed',
                    type: (lastStatusPayload.status || 'failed').toLowerCase(),
                    original_response_from_provider: lastStatusPayload
                }
            }
        }

        status = lastStatusPayload.status
        attempts++
    }

    if (status !== 'COMPLETED') {
        // Timed out or exceeded attempts – do not throw, return timeout error object
        return {
            error: {
                message: 'Prediction timed out on fal.ai – please try again later',
                type: 'timeout_error',
                original_response_from_provider: lastStatusPayload
            }
        }
    }

    // Fetch final result
    const resultRes = await fetch(resultUrl, {
        headers: {
            'Authorization': `Key ${providerKey}`
        }
    })

    const resultData = await resultRes.json()

    if (!resultRes.ok) {
        const providerMessage = extractProviderMessage(resultData)
        return {
            error: {
                message: providerMessage || 'Failed to fetch generation result',
                type: 'result_error',
                original_response_from_provider: resultData
            }
        }
    }

    // Collect image URLs (supports both array and single image response formats)
    const imageUrls = [
        // Flatten any nested arrays of images -> objects -> url
        ...(Array.isArray(resultData.images)
            ? resultData.images.flat(Infinity).map(i => i?.url).filter(Boolean)
            : []),
        // Fallback to single image object / string
        ...(resultData.image
            ? (typeof resultData.image === 'string'
                ? [resultData.image]
                : [resultData.image.url].filter(Boolean))
            : [])
    ]

    return {
        created: Math.floor(Date.now() / 1000),
        data: imageUrls.map(url => ({
            url,
            revised_prompt: null,
            original_response_from_provider: resultData
        })),
        seed: resultData.seed,
        original_response_from_provider: resultData
    }
}

// Wavespeed API call
async function generateWavespeed({ fetchParams }) {
    const providerUrl = `https://api.wavespeed.ai/api/v3/${fetchParams.model}`
    const providerKey = process.env.WAVESPEED_API_KEY

    if (!providerKey) {
        throw new Error('WAVESPEED_API_KEY environment variable is required for wavespeed provider')
    }

    const bodyPayload = {
        "output_format": "webp",
        "enable_base64_output": false,
        "enable_sync_mode": true,
        prompt: fetchParams.prompt
    }

    if (fetchParams.image) {
        bodyPayload.image = fetchParams.image
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        body: JSON.stringify(bodyPayload)
    })

    const result = await response.json()

    if (!response.ok) {
        const providerMessage = result.message || result.error || 'wavespeed request failed'
        throw {
            status: response.status,
            errorResponse: {
                status: response.status,
                statusText: response.statusText,
                error: {
                    message: providerMessage,
                    type: 'wavespeed_error'
                },
                original_response_from_provider: result
            }
        }
    }

    const data = result.data
    
    if (data.status === "failed") {
        return {
            error: {
                message: data.error || 'Generation failed',
                type: 'failed',
                original_response_from_provider: result
            }
        }
    }

    if (data.status !== "completed") {
        return {
            error: {
                message: 'Sync mode request did not complete successfully. Status: ' + data.status,
                type: 'wavespeed_sync_error',
                original_response_from_provider: result
            }
        }
    }

    const imageUrls = data.outputs

    return {
        created: Math.floor(Date.now() / 1000),
        data: imageUrls.map(url => ({
            url,
            revised_prompt: null,
        })),
    }
}

// Chutes HiDream API call
async function generateChutes({ fetchParams }) {
    // Detect if we are sending an input image. The InfiniteYou variant expects the field "id_image_b64",
    // whereas HiDream uses "image_b64". Treat either as an edit request for payload purposes.
    const hasImage = Boolean(fetchParams.image_b64 || fetchParams.id_image_b64)

    if (fetchParams.model === 'infiniteyou' && !hasImage) {
        throw new Error('No image provided. Please provide a reference image with a person in it.')
    }

    const subdomain = fetchParams.model

    const providerUrl = hasImage && subdomain === 'hidream'
        ? `https://chutes-${subdomain}-edit.chutes.ai/generate`
        : `https://chutes-${subdomain}.chutes.ai/generate`

    const providerKey = process.env.CHUTES_API_TOKEN

    if (!providerKey) {
        throw new Error('CHUTES_API_TOKEN environment variable is required for Chutes provider')
    }

    const bodyPayload = { prompt: fetchParams.prompt }

    // Attach the appropriate base64 field, stripping the data URI prefix if present.
    if (fetchParams.image_b64) {
        bodyPayload.image_b64 = fetchParams.image_b64.replace(/^data:[^;]+;base64,/, '')
    } else if (fetchParams.id_image_b64) {
        bodyPayload.id_image_b64 = fetchParams.id_image_b64.replace(/^data:[^;]+;base64,/, '')
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        body: JSON.stringify(bodyPayload)
    })

    const buffer = await response.arrayBuffer()

    if (!response.ok) {
        const errorText = buffer ? Buffer.from(buffer).toString('utf8') : response.statusText
        const formattedError = {
            status: response.status,
            statusText: response.statusText,
            error: {
                message: errorText || 'Chutes generation failed',
                type: 'chutes_error'
            }
        }
        throw {
            status: response.status,
            errorResponse: formattedError
        }
    }

    const base64Data = Buffer.from(buffer).toString('base64')

    return {
        created: Math.floor(Date.now() / 1000),
        data: [{
            b64_json: base64Data,
            revised_prompt: null
        }]
    }
}

async function generateGeminiImagen({ fetchParams }) {
    const providerKey = getGeminiApiKey(fetchParams.model)

    const providerUrl = `https://generativelanguage.googleapis.com/v1beta/models/${fetchParams.model}:predict?key=${providerKey}`

    const requestBody = {
        instances: [{
            prompt: fetchParams.prompt
        }],
        parameters: {
            sampleCount: 1,
            personGeneration: "allow_adult"
        }
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })

    const rawBody = await response.text()
    let data
    try {
        data = rawBody ? JSON.parse(rawBody) : null
    } catch (_) {
        data = null
    }

    if (!response.ok) {
        const formattedError = {
            status: data?.error?.code || response.status,
            statusText: data?.error?.status || response.statusText,
            error: {
                message: data?.error?.message || (rawBody || 'Imagen generation failed'),
                type: data?.error?.status || 'Unknown Error'
            },
            original_response_from_provider: data ?? rawBody
        }
        throw {
            status: response.status,
            errorResponse: formattedError
        }
    }

    if (!data) {
        throw {
            status: 502,
            errorResponse: {
                status: 502,
                statusText: 'Invalid JSON response from provider',
                error: {
                    message: 'Provider returned a non-JSON success response',
                    type: 'invalid_response'
                },
                original_response_from_provider: rawBody
            }
        }
    }

    // Collect base-64 image strings from the response
    const images = (data?.predictions || [])
        .map(p => p?.bytesBase64Encoded || p?.image?.bytesBase64Encoded || p?.bytes)
        .filter(Boolean)

    if (images.length === 0) {
        throw {
            status: 406,
            errorResponse: {
                status: 406,
                statusText: 'No image generated',
                error: {
                    message: 'No image data found in Imagen response',
                    type: 'No image generated'
                },
                original_response_from_provider: data
            }
        }
    }

    return {
        created: Math.floor(Date.now() / 1000),
        data: images.map(b64 => ({
            b64_json: b64,
            revised_prompt: null
        }))
    }
}

// OpenRouter image generation API call
async function generateOpenRouter({ fetchParams, userId }) {
    const providerUrl = 'https://openrouter.ai/api/v1/chat/completions'
    const providerKeys = (process.env.OPENROUTER_API_KEY || '')
        .split(',')
        .map(k => k.trim())
        .filter(Boolean)

    if (providerKeys.length === 0) {
        throw new Error('OPENROUTER_API_KEY environment variable is required for OpenRouter provider')
    }

    const providerKey = providerKeys[Math.floor(Math.random() * providerKeys.length)]
    console.log('Using OpenRouter key', Math.floor(Math.random() * providerKeys.length))

    let contentPayload

    // Build multimodal content array with text and image parts
    contentPayload = [{
        type: 'text',
        text: fetchParams.prompt
    }]

    if (fetchParams.imagesData && fetchParams.imagesData.length > 0) {
        for (const imageData of fetchParams.imagesData) {
            contentPayload.push({
                type: 'image_url',
                image_url: { url: imageData }
            })
        }
    }

    const requestBody = {
        model: fetchParams.model,
        messages: [{
            role: 'user',
            content: contentPayload
        }]
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`,
            'HTTP-Referer': 'https://imagerouter.io',
            'X-Title': 'ImageRouter'
        },
        body: JSON.stringify(requestBody)
    })

    const data = await response.json()

    if (!response.ok) {
        throw {
            status: response.status,
            errorResponse: data
        }
    }

    const images = data?.choices?.[0]?.message?.images || []

    if (images.length === 0) {
        throw {
            status: 406,
            errorResponse: {
                status: 406,
                statusText: 'No image generated',
                error: {
                    message: 'No image data found in OpenRouter response',
                    type: 'No image generated'
                },
                original_response_from_provider: data
            }
        }
    }

    // Convert data URLs to pure base64 strings
    const b64Images = images.map(imgObj => {
        const dataUrl = imgObj?.image_url?.url || ''
        return dataUrl.replace(/^data:[^;]+;base64,/, '')
    })

    return {
        created: Math.floor(Date.now() / 1000),
        data: b64Images.map(b64 => ({
            b64_json: b64,
            revised_prompt: null,
            original_response_from_provider: data
        }))
    }
}