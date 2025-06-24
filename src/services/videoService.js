import fs from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'
import { videoModels } from '../shared/videoModels/index.js'
import { getGeminiApiKey } from './imageHelpers.js'
import { b64VideoExample } from '../shared/videoModels/test/test_b64_json.js'
import { storageService } from './storageService.js'
import { pollReplicatePrediction } from './replicateUtils.js'

export async function generateVideo(fetchParams, userId, res, usageLogId) {
    const startTime = Date.now()
    const modelConfig = videoModels[fetchParams.model]
    const provider = modelConfig?.providers[0]?.id
    
    if (!provider) {
        throw new Error('Invalid model specified')
    }

    // Get alias model if available
    fetchParams.model = modelConfig.providers[0].model_name

    // Apply quality if available and a function is defined
    if (fetchParams.quality && typeof modelConfig.providers[0]?.applyQuality === 'function') {
        fetchParams = modelConfig.providers[0]?.applyQuality(fetchParams)
    }

    const providerHandlers = {
        gemini: generateGeminiVideo,
        vertex: generateVertexVideo,
        replicate: generateReplicateVideo,
        test: generateTestVideo,
        geminiMock: generateGeminiMockVideo,
        fal: generateFalVideo,
        wavespeed: generateWavespeedVideo
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

      // Clean up the heartbeat timer if the client disconnects early
      res.on('close', () => {
        if (intervalId) clearInterval(intervalId)
      })
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
      const processedResult = await storageService.processVideoResult(result, userId, fetchParams.response_format, usageLogId)
      return processedResult
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
            url: `https://raw.githubusercontent.com/DaWe35/image-router/refs/heads/main/src/shared/videoModels/test/big_buck_bunny_720p_1mb.mp4`,
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

// Add Replicate video generation handler
async function generateReplicateVideo({ fetchParams }) {
    const providerUrl = `https://api.replicate.com/v1/models/${fetchParams.model}/predictions`
    const providerKey = process.env.REPLICATE_API_KEY

    // Build the input object starting with the prompt
    const input = {
        prompt: fetchParams.prompt,
        enhance_prompt: true
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

// Fal.ai Queue API call for video generation
async function generateFalVideo({ fetchParams }) {
    const baseUrl = 'https://queue.fal.run'
    const providerKey = process.env.FAL_API_KEY

    if (!providerKey) {
        throw new Error('FAL_API_KEY environment variable is required for fal.ai provider')
    }

    // Prepare body with supported parameters
    const bodyPayload = {
        prompt: fetchParams.prompt,
        duration: 5,
        resolution: '720p'
    }
    if (fetchParams.image) bodyPayload.image_url = fetchParams.image

    // Submit request
    const submitResponse = await fetch(`${baseUrl}/${fetchParams.model}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Key ${providerKey}`
        },
        body: JSON.stringify(bodyPayload)
    })

    const submitData = await submitResponse.json()

    if (!submitResponse.ok) {
        throw {
            status: submitResponse.status,
            errorResponse: submitData
        }
    }

    const statusUrl = submitData.status_url || `${baseUrl}/${fetchParams.model}/requests/${submitData.request_id}/status`
    const resultUrl = submitData.response_url || `${baseUrl}/${fetchParams.model}/requests/${submitData.request_id}`

    // Polling loop
    let status = submitData.status
    let attempts = 0
    const maxAttempts = 120 // 10 minutes @ 5s
    const delay = 5000
    let lastStatusPayload = submitData

    while (status !== 'COMPLETED' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay))
        const pollRes = await fetch(statusUrl + '?logs=0', {
            headers: {
                'Authorization': `Key ${providerKey}`
            }
        })
        lastStatusPayload = await pollRes.json()

        if (!pollRes.ok) {
            return {
                error: {
                    message: lastStatusPayload?.error || 'Polling request failed',
                    type: 'polling_error',
                    original_response_from_provider: lastStatusPayload
                }
            }
        }

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
        return {
            error: {
                message: resultData?.error || 'Failed to fetch generation result',
                type: 'result_error',
                original_response_from_provider: resultData
            }
        }
    }

    const videoUrl = resultData?.video?.url || null

    if (!videoUrl) {
        return {
            error: {
                message: 'No video URL found in response',
                type: 'no_video',
                original_response_from_provider: resultData
            }
        }
    }

    return {
        created: Math.floor(Date.now() / 1000),
        data: [{
            url: videoUrl,
            revised_prompt: null,
        }],
        seed: resultData.seed
    }
}

// Wavespeed.ai video generation handler
async function generateWavespeedVideo({ fetchParams }) {
    const baseUrl = 'https://api.wavespeed.ai/api/v3'
    const providerKey = process.env.WAVESPEED_API_KEY

    if (!providerKey) {
        throw new Error('WAVESPEED_API_KEY environment variable is required for wavespeed.ai provider')
    }

    const input = {
        prompt: fetchParams.prompt,
        duration: fetchParams.model.includes('hailuo-02') ? 6 : 5 // Use 6-second duration for MiniMax Hailuo-02 models, otherwise default to 5
    }

    const submitResponse = await fetch(`${baseUrl}/${fetchParams.model}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        body: JSON.stringify(input)
    })

    const submitData = await submitResponse.json()

    if (!submitResponse.ok) {
        const formattedError = {
            status: submitData?.code || submitResponse.status,
            statusText: submitData?.message || submitResponse.statusText,
            error: {
                message: submitData?.message || 'Video generation failed',
                type: (submitData?.code ? `code_${submitData.code}` : 'unknown_error')
            },
            original_response_from_provider: submitData
        }
        throw {
            status: submitResponse.status,
            errorResponse: formattedError
        }
    }

    // Derive polling URL – prefer urls.get if provided, else construct from id
    const predictionId = submitData?.data?.id || submitData?.data?.task_id || submitData?.id
    let pollUrl = submitData?.data?.urls?.get
    if (!pollUrl && predictionId) {
        pollUrl = `${baseUrl}/predictions/${predictionId}/result`
    }

    if (!pollUrl) {
        throw {
            status: 500,
            errorResponse: { message: 'Unable to determine polling URL from Wavespeed response', original_response_from_provider: submitData }
        }
    }

    // Poll until completed or timeout
    let attempts = 0
    const maxAttempts = 120 // 10 minutes @ 5s
    const delay = 5000
    let lastStatusPayload = submitData

    while (attempts < maxAttempts) {
        // Check completed immediately on first loop in case submitData already includes outputs
        const currentStatus = lastStatusPayload?.data?.status || lastStatusPayload?.status
        if (currentStatus === 'completed' && Array.isArray(lastStatusPayload?.data?.outputs) && lastStatusPayload.data.outputs.length > 0) {
            break
        }

        await new Promise(resolve => setTimeout(resolve, delay))

        const pollRes = await fetch(pollUrl, {
            headers: {
                'Authorization': `Bearer ${providerKey}`
            }
        })

        lastStatusPayload = await pollRes.json()

        if (!pollRes.ok) {
            return {
                error: {
                    message: lastStatusPayload?.error || 'Polling request failed',
                    type: 'polling_error',
                    original_response_from_provider: lastStatusPayload
                }
            }
        }

        const status = lastStatusPayload?.data?.status || lastStatusPayload?.status

        if (status === 'failed') {
            return {
                error: {
                    message: lastStatusPayload?.data?.error || 'Generation failed',
                    type: 'failed',
                    original_response_from_provider: lastStatusPayload
                }
            }
        }

        if (status === 'completed') {
            break
        }

        attempts++
    }

    // Timeout handling
    const finalStatus = lastStatusPayload?.data?.status || lastStatusPayload?.status
    if (finalStatus !== 'completed') {
        return {
            error: {
                message: 'Prediction timed out on wavespeed.ai – please try again later',
                type: 'timeout_error',
                original_response_from_provider: lastStatusPayload
            }
        }
    }

    const outputs = lastStatusPayload?.data?.outputs || []

    if (!outputs.length) {
        return {
            error: {
                message: 'No video URL found in response',
                type: 'no_video',
                original_response_from_provider: lastStatusPayload
            }
        }
    }

    return {
        created: Math.floor(Date.now() / 1000),
        data: outputs.map(url => ({
            url,
            revised_prompt: null,
        }))
    }
}