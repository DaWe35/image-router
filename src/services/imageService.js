import fetch from 'node-fetch'
import { imageModels } from '../shared/common.js'

export async function generateImage(reqBody, userId) {
    const { model } = reqBody
    const modelConfig = imageModels[model]
    const provider = modelConfig.providers[0]
    
    if (!provider) {
        throw new Error('Invalid model specified')
    }

    // Use the alias model if available, otherwise use the original model
    const modelName = modelConfig.aliasOf || model

    let providerUrl
    let providerKey
    switch (provider) {
        case 'openai':
            providerUrl = 'https://api.openai.com/v1/images/generations'
            providerKey = process.env.OPENAI_API_KEY
            const modelNameWithoutOpenAI = modelName.replace('openai/', '')
            return generateOpenAI({ providerUrl, providerKey, reqBody, modelName: modelNameWithoutOpenAI, userId })
        case 'deepinfra':
            providerUrl = 'https://api.deepinfra.com/v1/openai/images/generations'
            providerKey = process.env.DEEPINFRA_API_KEY
            return generateDeepInfra({ providerUrl, providerKey, reqBody, modelName, userId })
        case 'replicate':
            providerUrl = `https://api.replicate.com/v1/models/${modelName}/predictions`
            providerKey = process.env.REPLICATE_API_KEY
            return generateReplicate({ providerUrl, providerKey, reqBody, modelName })
        case 'google':
            const modelNameWithoutGoogle = modelName.replace('google/', '')
            providerKey = process.env.GOOGLE_GEMINI_API_KEY
            providerUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelNameWithoutGoogle}:generateContent?key=${providerKey}`
            return generateGoogle({ providerUrl, providerKey, reqBody, modelName, userId })
    }    
}

// OpenAI format API call
async function generateOpenAI({ providerUrl, providerKey, reqBody, modelName, userId }) {
    if (!providerKey) {
        throw new Error('Provider API key is not configured. This is an issue on our end.')
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        // TODO: Enable customization
        body: JSON.stringify({
            prompt: reqBody.prompt,
            model: modelName,
            user: userId,
            //n: 1,
            //size: '1024x1024',
            //response_format: 'url'
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
    return data
}

// OpenAI format API call
async function generateDeepInfra({ providerUrl, providerKey, reqBody, modelName, userId }) {
    if (!providerKey) {
        throw new Error('Provider API key is not configured. This is an issue on our end.')
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        // TODO: Enable customization
        body: JSON.stringify({
            prompt: reqBody.prompt,
            model: modelName,
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
              error: {
                message: errorResponse?.error?.message,
                type: errorResponse?.error?.type || errorResponse?.statusText
              }
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
async function generateReplicate({ providerUrl, providerKey, reqBody }) {
    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Prefer': 'wait',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        body: JSON.stringify({
            input: {
                prompt: reqBody.prompt
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
async function generateGoogle({ providerUrl, providerKey, reqBody, modelName, userId }) {
    if (!providerKey) {
        throw new Error('Provider API key is not configured. This is an issue on our end.')
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "contents": [{
                "parts": [
                    {"text": reqBody.prompt}
                ]
            }],
            "generationConfig":{"responseModalities":["Text","Image"]}
        })
    })

    if (!response.ok) {
        const errorResponse = await response.json()
        const formattedError = {
            status: errorResponse?.error?.code,
            statusText: errorResponse?.error?.status,
            error: {
              error: {
                message: errorResponse?.error?.message,
                type: errorResponse?.error?.status
              }
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
        return {
            status: 200,
            statusText: 'No image generated',
            error: {
              error: {
                message: data?.candidates[0]?.content?.parts[0]?.text || null,
                type: 'No image generated'
              }
            },
            original_response_from_provider: data
          }
    }
}