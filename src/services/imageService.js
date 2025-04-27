import fetch from 'node-fetch'
import pkg from 'https-proxy-agent'
const { HttpsProxyAgent } = pkg
import { models } from '../shared/models/index.js'

export async function generateImage(params, userId) {
    const startTime = Date.now()
    const modelConfig = models[params.model]
    const provider = modelConfig.providers[0].id
    
    if (!provider) {
        throw new Error('Invalid model specified')
    }

    // Use the alias model if available, otherwise use the original model
    const modelToUse = modelConfig.aliasOf || params.model

    // Apply quality if available and a function is defined
    if (params.quality && typeof modelConfig.providers[0]?.applyQuality === 'function') {
        params = modelConfig.providers[0]?.applyQuality(params, params.quality)
    }

    let result
    switch (provider) {
        case 'openai':
            result = await generateOpenAI({ params, modelToUse, userId })
            break
        case 'deepinfra':
            result = await generateDeepInfra({ params, modelToUse, userId })
            break
        case 'replicate':
            result = await generateReplicate({ params, modelToUse })
            break
        case 'google':
            result = await generateGoogle({ params, modelToUse, userId })
            break
    }
    result.latency = Date.now() - startTime
    return result
}

// OpenAI format API call
async function generateOpenAI({ params, modelToUse, userId }) {
    const providerUrl = 'https://api.openai.com/v1/images/generations'
    const providerKey = process.env.OPENAI_API_KEY
    const modelToUseWithoutOpenAI = modelToUse.replace('openai/', '')


    params.model = modelToUseWithoutOpenAI // override model
    params.user = userId
    params.n = 1
    if (modelToUseWithoutOpenAI === 'gpt-image-1') params.moderation = 'low'

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        // TODO: Enable customization
        body: JSON.stringify(params)
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
async function generateDeepInfra({ params, modelToUse, userId }) {
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
            prompt: params.prompt,
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
async function generateReplicate({ params, modelToUse }) {
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
                prompt: params.prompt
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
async function generateGoogle({ params, modelToUse, userId }) {
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
                    {"text": params.prompt}
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

    if (data?.candidates[0]?.content?.parts[0]?.inlineData?.data) {
        return {
            created: Math.floor(new Date().getTime() / 1000),
            data: [{
                b64_json: data?.candidates[0]?.content?.parts[0]?.inlineData?.data || null,
                revised_prompt: null,
                original_response_from_provider: data
            }]
        }
    } else {
        throw {
            status: 406,
            errorResponse: {
                status: 406,
                statusText: 'No image generated',
                error: {
                    message: data?.candidates[0]?.content?.parts[0]?.text || null,
                    type: 'No image generated'
                },
                original_response_from_provider: data
              }
        }
    }
}