import fs from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'
import { videoModels } from '../shared/videoModels/index.js'
import { getGeminiApiKey } from './imageHelpers.js'
import { b64VideoExample } from '../shared/videoModels/test/test_b64_json.js'

export async function generateVideo(fetchParams, userId, res) {
    const startTime = Date.now()
    const modelConfig = videoModels[fetchParams.model]
    const provider = modelConfig?.providers[0]?.id
    
    if (!provider) {
        throw new Error('Invalid model specified')
    }

    // Get alias model if available
    fetchParams.model = modelConfig.aliasOf || fetchParams.model

    // Apply quality if available and a function is defined
    if (fetchParams.quality && typeof modelConfig.providers[0]?.applyQuality === 'function') {
        fetchParams = modelConfig.providers[0]?.applyQuality(fetchParams)
    }

    const providerHandlers = {
        gemini: generateGeminiVideo,
        vertex: generateVertexVideo,
        test: generateTestVideo,
        geminiMock: generateGeminiMockVideo
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
      return result
    } catch (error) {
      if (intervalId) clearInterval(intervalId)
      throw error
    }
}

async function generateGeminiVideo({ fetchParams, userId }) {
    const providerKey = getGeminiApiKey(fetchParams.model)
    
    const baseUrl = 'https://generativelanguage.googleapis.com/v1beta'
    const predictUrl = `${baseUrl}/models/${fetchParams.model}:predictLongRunning?key=${providerKey}`

    // Start the video generation operation
    const response = await fetch(predictUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "instances": [{
                "prompt": fetchParams.prompt
            }],
            "parameters": {
                "aspectRatio": "16:9",
                "personGeneration": "allow_adult",
                "sampleCount": 1,
                "durationSeconds": 5,
            }
        })
    })

    if (!response.ok) {
        const errorData = await response.json()
        const formattedError = {
            status: errorData?.error?.code || response.status,
            statusText: errorData?.error?.status || response.statusText,
            error: {
                message: errorData?.error?.message || 'Video generation failed',
                type: errorData?.error?.status || 'Unknown Error'
            },
            original_response_from_provider: errorData
        }
        throw {
            status: response.status,
            errorResponse: formattedError
        }
    }

    const operationData = await response.json()
    const operationName = operationData.name

    if (!operationName) {
        console.log('ERROR: no operation name returned from video generation request:', operationData)
        return {
            error: {
                message: 'no operation name returned from video generation request: ' + JSON.stringify(operationData),
                type: 'internal_error'
            }
        }
    }

    // Poll for completion
    const checkUrl = `${baseUrl}/${operationName}?key=${providerKey}`
    let isDone = false
    let attempts = 0
    const maxAttempts = 120 // 10 minutes with 5-second intervals

    while (!isDone && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
        attempts++

        const checkResponse = await fetch(checkUrl, {
            method: 'GET'
        })

        if (!checkResponse.ok) {
            const errorData = await checkResponse.json()
            console.log('ERROR: video generation check failed:', errorData)
        }

        const checkData = await checkResponse.json()
        isDone = checkData.done

        if (isDone) {
            if (checkData.error) {
                console.log('ERROR: video generation failed:', checkData.error)
                return {
                    error: {
                        message: 'video generation failed: ' + JSON.stringify(checkData.error),
                        type: 'internal_error'
                    }
                }
            }

            // Extract video URLs from response
            const generatedSamples = checkData.response?.generateVideoResponse?.generatedSamples
            
            if (!generatedSamples || generatedSamples.length === 0) {
                console.log('ERROR: no video samples found in response:', checkData)
                return {
                    error: {
                        message: 'no video samples found in response: ' + JSON.stringify(checkData),
                        type: 'internal_error'
                    }
                }
            }

            // Return in OpenAI-compatible format with all videos
            return {
                created: Math.floor(new Date().getTime() / 1000),
                data: generatedSamples.map(sample => ({
                    url: `${process.env.API_URL}/proxy/video?url=${encodeURIComponent(sample.video.uri)}&model=${encodeURIComponent(fetchParams.model)}`,
                    revised_prompt: null
                }))
            }
        }
    }

    // If we reach here, the operation timed out
    console.log('ERROR: video generation timed out after 10 minutes. Url:', checkUrl)
}

async function generateVertexVideo({ fetchParams, userId }) {
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

    const baseUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${fetchParams.model}`
    const predictUrl = `${baseUrl}:predictLongRunning`

    // Build request body according to Vertex AI Veo API
    const requestBody = {
        instances: [{
            prompt: fetchParams.prompt
        }],
        parameters: {
            aspectRatio: "16:9",
            personGeneration: "allow_adult",
            sampleCount: 1,
            durationSeconds: 8, // veo-3 supports 8 seconds
        }
    }

    // Add generateAudio for veo-3
    if (fetchParams.model === 'veo-3.0-generate-preview') {
        requestBody.parameters.generateAudio = false
    }

    // Start the video generation operation
    const response = await fetch(predictUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
        const errorData = await response.json()
        const formattedError = {
            status: errorData?.error?.code || response.status,
            statusText: errorData?.error?.status || response.statusText,
            error: {
                message: errorData?.error?.message || 'Video generation failed',
                type: errorData?.error?.status || 'Unknown Error'
            },
            original_response_from_provider: errorData
        }
        throw {
            status: response.status,
            errorResponse: formattedError
        }
    }

    const operationData = await response.json()
    const operationName = operationData.name

    if (!operationName) {
        console.log('ERROR: no operation name returned from video generation request:', operationData)
        // no throw here, because throw would refund the user's credit while the video might still be generated
        return {
            error: {
                message: 'no operation name returned from video generation request.',
                type: 'internal_error',
                original_response_from_provider: operationData
            }
        }
    }

    // Poll for completion using fetchPredictOperation
    const checkUrl = `${baseUrl}:fetchPredictOperation`
    let isDone = false
    let attempts = 0
    const maxAttempts = 120 // 10 minutes with 5-second intervals

    while (!isDone && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
        attempts++

        const checkResponse = await fetch(checkUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operationName: operationName
            })
        })

        if (!checkResponse.ok) {
            const errorData = await checkResponse.json()
            console.log('ERROR: video generation check failed:', errorData)
            continue
        }

        const checkData = await checkResponse.json()
        isDone = checkData.done

        if (isDone) {
            if (checkData.error) {
                console.log('ERROR: video generation failed:', checkData.error)
                return {
                    error: {
                        message: 'video generation failed: ' + JSON.stringify(checkData.error),
                        type: 'internal_error',
                        original_response_from_provider: checkData
                    }
                }
            }

            // Extract video URLs from response - Vertex AI format
            const generatedSamples = checkData.response?.generatedSamples
            
            if (!generatedSamples || generatedSamples.length === 0) {
                console.log('ERROR: no video samples found in response:', checkData)
                return {
                    error: {
                        message: 'no video samples found in response: ' + JSON.stringify(checkData),
                        type: 'internal_error',
                        original_response_from_provider: checkData
                    }
                }
            }

            // Return in OpenAI-compatible format with all videos as base64
            return {
                created: Math.floor(new Date().getTime() / 1000),
                data: generatedSamples.map(sample => {
                    // Vertex AI returns base64 video data when no storageUri is specified
                    const base64Data = sample.video?.bytesBase64Encoded || sample.bytesBase64Encoded
                    
                    if (!base64Data) {
                        console.log('ERROR: no base64 video data found in sample:', sample)
                        return {
                            error: 'No video data found in response sample',
                            revised_prompt: null,
                        }
                    }
                    
                    return {
                        b64_json: base64Data,
                        revised_prompt: null,
                    }
                }),
                original_response_from_provider: checkData
            }
        }
    }

    // If we reach here, the operation timed out
    console.log('ERROR: video generation timed out after 10 minutes. Operation:', operationName)
    return {
        error: {
            message: 'video generation timed out after 10 minutes. Operation: ' + operationName,
            type: 'timeout_error',
            original_response_from_provider: checkData
        }
    }
}

async function generateTestVideo({ fetchParams, userId }) {
    // Return a placeholder video URL for testing
    return {
        created: Math.floor(Date.now() / 1000),
        data: [{
            url: `https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4`,
            revised_prompt: null
        }]
    }
} 

async function generateGeminiMockVideo({ fetchParams, userId }) {
    const checkData = {
        "name": "models/veo-2.0-generate-001/operations/ld6i6vp968tt",
        "done": true,
        "response": {
            "@type": "type.googleapis.com/google.ai.generativelanguage.v1beta.PredictLongRunningResponse",
            "generateVideoResponse": {
                "generatedSamples": [
                    {
                        "video": {
                            "b64_json": b64VideoExample,
                            "revised_prompt": null,
                        }
                    },
                    {
                        "video": {
                            "uri": "https://generativelanguage.googleapis.com/v1beta/files/zsmxt6ue9jk1:download?alt=media",
                            "revised_prompt": null,
                        }
                    }
                ]
            }
        }
    }
    const isDone = checkData.done

    if (isDone) {
        if (checkData.error) {
            console.log('ERROR: video generation failed:', checkData.error)
            return {
                error: {
                    message: 'video generation failed: ' + JSON.stringify(checkData.error),
                    type: 'internal_error'
                }
            }
        }

        // Extract video URLs from response
        const generatedSamples = checkData.response?.generateVideoResponse?.generatedSamples
        
        if (!generatedSamples || generatedSamples.length === 0) {
            console.log('ERROR: no video samples found in response:', checkData)
            return {
                error: {
                    message: 'no video samples found in response: ' + JSON.stringify(checkData),
                    type: 'internal_error'
                }
            }
        }

        // Return in OpenAI-compatible format with all videos
        return {
            created: Math.floor(new Date().getTime() / 1000),
            data: generatedSamples.map(sample => ({
                url: `${process.env.API_URL}/proxy/video?url=${encodeURIComponent(sample.video.uri)}&model=${encodeURIComponent(fetchParams.model)}`,
                revised_prompt: null
            }))
        }
    }

    // If we reach here, the operation timed out
    console.log('ERROR: video generation timed out after 10 minutes. Url:', checkUrl)
}