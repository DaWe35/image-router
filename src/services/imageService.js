import fetch from 'node-fetch'
import { imageModels } from '../shared/common.js'

export async function generateImage(reqBody) {
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
            return generateOpenAI({ providerUrl, providerKey, reqBody, modelName: modelNameWithoutOpenAI })
        case 'deepinfra':
            providerUrl = 'https://api.deepinfra.com/v1/openai/images/generations'
            providerKey = process.env.DEEPINFRA_API_KEY
            return generateOpenAI({ providerUrl, providerKey, reqBody, modelName })
        case 'replicate':
            providerUrl = `https://api.replicate.com/v1/models/${modelName}/predictions`
            providerKey = process.env.REPLICATE_API_KEY
            return generateReplicate({ providerUrl, providerKey, reqBody, modelName })
    }    
}

// OpenAI format API call
async function generateOpenAI({ providerUrl, providerKey, reqBody, modelName }) {
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
            url: data?.output,
            revised_prompt: null,
            original_response_from_provider: data
        }]
    }
    return convertedData
}
