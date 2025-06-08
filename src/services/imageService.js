import fs from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'
import pkg from 'https-proxy-agent'
const { HttpsProxyAgent } = pkg
import { imageModels } from '../shared/imageModels/index.js'
import { objectToFormData, getGeminiApiKey } from './imageHelpers.js'
import { storageService } from './storageService.js'

export async function generateImage(fetchParams, userId, res, usageLogId) {
    const startTime = Date.now()
    const modelConfig = imageModels[fetchParams.model]
    const provider = modelConfig?.providers[0]?.id
    
    if (!provider) {
        throw new Error('Invalid model specified')
    }

    // Apply image editing if available
    if (fetchParams.files.image) {
        if (typeof modelConfig.providers[0]?.applyImage === 'function') {
            fetchParams = await modelConfig.providers[0]?.applyImage(fetchParams)
        } else {
            const supportedModels = Object.keys(imageModels).filter(modelId => 
                imageModels[modelId].supported_params?.edit === true
            )
            throw new Error(`Image editing is not supported for this model. Supported models: ${supportedModels.join(', ')}`)
        }
    }

    // Apply mask editing if available
    if (fetchParams.files.mask) {
        if (typeof modelConfig.providers[0]?.applyMask === 'function') {
            fetchParams = await modelConfig.providers[0]?.applyMask(fetchParams)
        } else {
            throw new Error('Mask editing is not supported for this model')
        }
    }
    delete fetchParams.files

    // Get alias model if available
    fetchParams.model = modelConfig.providers[0].model_name

    // Apply quality if available and a function is defined. This can change the model to use, or any other variables!
    if (fetchParams.quality && typeof modelConfig.providers[0]?.applyQuality === 'function') {
        fetchParams = modelConfig.providers[0]?.applyQuality(fetchParams)
    }


    const providerHandlers = {
      openai: generateOpenAI,
      deepinfra: generateDeepInfra,
      replicate: generateReplicate,
      gemini: generateGemini,
      vertex: generateVertex,
      test: generateTest
    }

    const handler = providerHandlers[provider]
    if (!handler) {
      throw new Error(`No handler implemented for provider ${provider}`)
    }

    let intervalId
    if (res) {
      res.setHeader('Content-Type', 'application/json')
      res.flushHeaders()
      const heartbeatInterval = 3000 // 3 seconds
      intervalId = setInterval(() => {
        res.write(' ')
      }, heartbeatInterval)
    }

    try {
      const result = await handler({ fetchParams, userId })
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

// OpenAI format API call
async function generateOpenAI({ fetchParams, userId }) {
    // Detect if this is an edit request
    const isEdit = Boolean(fetchParams.image)
    const providerUrl = isEdit ? 'https://api.openai.com/v1/images/edits' : 'https://api.openai.com/v1/images/generations'
    const providerKey = process.env.OPENAI_API_KEY
    
    // Set up basic parameters
    fetchParams.user = userId
    fetchParams.n = 1
    if (fetchParams.model === 'gpt-image-1') fetchParams.moderation = 'low'

    const headers = {
        'Authorization': `Bearer ${providerKey}`
    }
    
    // Don't set Content-Type for multipart form data when using fetch with FormData
    // The browser/runtime will set it automatically with the correct boundary

    const body = isEdit ? objectToFormData(fetchParams) : JSON.stringify(fetchParams)
    
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
async function generateDeepInfra({ fetchParams, userId }) {
    const providerUrl = 'https://api.deepinfra.com/v1/openai/images/generations'
    const providerKey = process.env.DEEPINFRA_API_KEY

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        // TODO: Enable customization
        body: JSON.stringify({
            prompt: fetchParams.prompt,
            model: fetchParams.model,
            user: userId,
            //n: 1,
            //size: '1024x1024',
            //response_format: 'url'
        })
    })

    if (!response.ok) {
        const errorResponse = await response.json()
        const formattedError = {
            status: errorResponse?.status || 500,
            statusText: errorResponse?.statusText || 'Unknown Error',
            error: {
                message: errorResponse?.error?.message || 'An unknown error occurred (152)',
                type: errorResponse?.error?.type || errorResponse?.statusText || 'Unknown Error'
            },
            original_response_from_provider: errorResponse
          }
        throw {
            status: response.status,
            errorResponse: formattedError
        }
    }

    const data = await response.json()
    return data
}

// Replicate format API call
async function generateReplicate({ fetchParams }) {
    const providerUrl = `https://api.replicate.com/v1/models/${fetchParams.model}/predictions`
    const providerKey = process.env.REPLICATE_API_KEY

    // Build the input object starting with the prompt
    const input = {
        prompt: fetchParams.prompt
    }

    // Add input_image if available (for image editing models like flux-kontext-max)
    if (fetchParams.image) {
        const arrayBuffer = await fetchParams.image.blob.arrayBuffer()
        const base64Data = Buffer.from(arrayBuffer).toString('base64')
        input.input_image = "data:application/octet-stream;base64," + base64Data
        input.aspect_ratio = 'match_input_image'
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Prefer': 'wait',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        body: JSON.stringify({
            input: input
        })
    })
    
    const data = await response.json()
    if (!response.ok) {
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
            status: response.status,
            errorResponse: formattedError
        }
    }

    
    const convertedData = {
        created: Math.floor(new Date(data.created_at).getTime() / 1000),
        data: [{
            url: data?.output || null,
            revised_prompt: null,
            original_response_from_provider: data
        }]
    }
    return convertedData
}


// OpenAI format API call
async function generateGemini({ fetchParams, userId }) {
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

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "contents": [{
                "parts": parts
            }],
            "generationConfig": {"responseModalities": ["Text", "Image"]}
        }),
        agent
    })

    const data = await response.json()

    if (!response.ok) {
        const formattedError = {
            status: data?.error?.code,
            statusText: data?.error?.status,
            error: {
                message: data?.error?.message,
                type: data?.error?.status
            },
            original_response_from_provider: data
        }
        if (formattedError?.statusText === 'RESOURCE_EXHAUSTED' && fetchParams.model === 'gemini-2.0-flash-exp-image-generation') {
            formattedError.error.message = 'This model hit a global rate limit. Please try again later or switch to the "google/gemini-2.0-flash-prev" model for increased limits.'
        }
        throw {
            status: response.status,
            errorResponse: formattedError
        }
    }
    
    // Find image data in any part of the response
    let imageData = null
    if (data?.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
            if (part?.inlineData?.data) {
                imageData = part.inlineData.data
                break
            }
        }
    }

    if (imageData) {
        return {
            created: Math.floor(new Date().getTime() / 1000),
            data: [{
                b64_json: imageData,
                revised_prompt: null,
            }]
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

async function generateVertex({ fetchParams, userId }) {
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
            errorResponse: errorResponse
        }
    }

    const data = await response.json()
    
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

    if (fetchParams.response_format === 'b64_json') {
        responseData.b64_json = b64_json
    } else {
        responseData.url = `https://raw.githubusercontent.com/DaWe35/image-router/refs/heads/main/src/shared/imageModels/test/${fetchParams.quality}.png`
    }

    return {
        created: Date.now(),
        data: [responseData]
    }
}