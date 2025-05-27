import fs from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'
import { videoModels } from '../shared/videoModels/index.js'
import { getGeminiApiKey } from './imageHelpers.js'

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
                            "uri": "https://generativelanguage.googleapis.com/v1beta/files/9lbljgk3xl87:download?alt=media"
                        }
                    },
                    {
                        "video": {
                            "uri": "https://generativelanguage.googleapis.com/v1beta/files/zsmxt6ue9jk1:download?alt=media"
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