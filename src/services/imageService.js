import fetch from 'node-fetch'
import fs from 'fs/promises'
import path from 'path'
import pkg from 'https-proxy-agent'
const { HttpsProxyAgent } = pkg
import { models } from '../shared/models/index.js'

export async function generateImage(params, userId) {
    let fetchParams = structuredClone(params) // prevent side effects
    const startTime = Date.now()
    const modelConfig = models[fetchParams.model]
    const provider = modelConfig?.providers[0]?.id
    
    if (!provider) {
        throw new Error('Invalid model specified')
    }

    // Use the alias model if available, otherwise use the original model
    const modelToUse = modelConfig.aliasOf || fetchParams.model

    // Apply quality if available and a function is defined
    if (fetchParams.quality && typeof modelConfig.providers[0]?.applyQuality === 'function') {
        fetchParams = modelConfig.providers[0]?.applyQuality(fetchParams, fetchParams.quality)
    }

    let result
    switch (provider) {
        case 'openai':
            result = await generateOpenAI({ fetchParams, modelToUse, userId })
            break
        case 'deepinfra':
            result = await generateDeepInfra({ fetchParams, modelToUse, userId })
            break
        case 'replicate':
            result = await generateReplicate({ fetchParams, modelToUse })
            break
        case 'google':
            result = await generateGoogle({ fetchParams, modelToUse, userId })
            break
        case 'test':
            result = await generateTest({ fetchParams, modelToUse, userId })
            break
    }
    result.latency = Date.now() - startTime
    return result
}

// OpenAI format API call
async function generateOpenAI({ fetchParams, modelToUse, userId }) {
    const providerUrl = 'https://api.openai.com/v1/images/generations'
    const providerKey = process.env.OPENAI_API_KEY
    const modelToUseWithoutOpenAI = modelToUse.replace('openai/', '')

    fetchParams.model = modelToUseWithoutOpenAI // override model
    fetchParams.user = userId
    fetchParams.n = 1
    if (modelToUseWithoutOpenAI === 'gpt-image-1') fetchParams.moderation = 'low'

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        // TODO: Enable customization
        body: JSON.stringify(fetchParams)
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
async function generateDeepInfra({ fetchParams, modelToUse, userId }) {
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
            model: modelToUse,
            user: userId,
            //n: 1,
            //size: '1024x1024',
            //response_format: 'url'
        })
    })

    if (!response.ok) {
        const errorResponse = await response.json()
        const formattedError = {
            status: errorResponse?.status,
            statusText: errorResponse?.statusText,
            error: {
                message: errorResponse?.error?.message,
                type: errorResponse?.error?.type || errorResponse?.statusText
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
async function generateReplicate({ fetchParams, modelToUse }) {
    const providerUrl = `https://api.replicate.com/v1/models/${modelToUse}/predictions`
    const providerKey = process.env.REPLICATE_API_KEY

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Prefer': 'wait',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        body: JSON.stringify({
            input: {
                prompt: fetchParams.prompt
            }
        })
    })
    
    if (!response.ok) {
        const errorResponse = await response.json()
        throw {
            status: response.status,
            errorResponse: errorResponse
        }
    }

    const data = await response.json()
    
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
async function generateGoogle({ fetchParams, modelToUse, userId }) {
    const modelToUseWithoutGoogle = modelToUse.replace('google/', '')
    const providerKey = process.env.GOOGLE_GEMINI_API_KEY
    const providerUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUseWithoutGoogle}:generateContent?key=${providerKey}`

    // Get webshare proxy credentials from environment variables
    const proxyUrl = process.env.PROXY_URL

    // Create proxy agent if all proxy credentials are available
    let agent = null
    if (proxyUrl) {
        agent = new HttpsProxyAgent(proxyUrl)
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "contents": [{
                "parts": [
                    {"text": fetchParams.prompt}
                ]
            }],
            "generationConfig":{"responseModalities":["Text","Image"]}
        }),
        agent
    })

    if (!response.ok) {
        const errorResponse = await response.json()
        const formattedError = {
            status: errorResponse?.error?.code,
            statusText: errorResponse?.error?.status,
            error: {
                message: errorResponse?.error?.message,
                type: errorResponse?.error?.status
            },
            original_response_from_provider: errorResponse
          }
        throw {
            status: response.status,
            errorResponse: formattedError
        }
    }

    const data = await response.json()

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
                original_response_from_provider: data
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

async function generateTest({ fetchParams, modelToUse, userId }) {
    // Read the image file
    const imagePath = path.resolve(`src/shared/models/test/${fetchParams?.quality || 'auto'}.png`)
    const imageBuffer = await fs.readFile(imagePath)
    const b64_json = imageBuffer.toString('base64')
    
    // Return a random placeholder image
    return {
        created: Date.now(),
        data: [{
            url: `https://raw.githubusercontent.com/DaWe35/image-router/refs/heads/tests/src/shared/models/test/${fetchParams.quality}.png`,
            b64_json,
            revised_prompt: null,
            original_response_from_provider: {
                "yeah": "this is m.t.",
                "whats up": "btw?"
            }
        }]
    }
}