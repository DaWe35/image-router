import fetch from 'node-fetch'
import { imageModels } from '../shared/common.js'


export async function generateImage(reqBody) {
    const { model } = reqBody
    const provider = imageModels[model].providers[0]
    
    if (!provider) {
        throw new Error('Invalid model specified')
    }

    let providerUrl
    let providerKey
    switch (provider) {
        case 'openai':
            providerUrl = 'https://api.openai.com/v1/images/generations'
            providerKey = process.env.OPENAI_API_KEY
            reqBody.model = reqBody.model.replace('openai/', '')
            return generateOpenAI({ providerUrl, providerKey, reqBody })
        case 'deepinfra':
            providerUrl = 'https://api.deepinfra.com/v1/openai/images/generations'
            providerKey = process.env.DEEPINFRA_API_KEY
            return generateOpenAI({ providerUrl, providerKey, reqBody })
        case 'replicate':
            providerUrl = `https://api.replicate.com/v1/models/${reqBody.model}/predictions`
            providerKey = process.env.REPLICATE_API_KEY
            return generateReplicate({ providerUrl, providerKey, reqBody })
    }    
}

// OpenAI format API call to any provider that supports
async function generateOpenAI({ providerUrl, providerKey, reqBody }) {
    if (!providerKey) {
        throw new Error('Provider API key is not configured. This is an issue on our end.')
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        body: JSON.stringify(reqBody)
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

async function generateReplicate({ providerUrl, providerKey, reqBody }) {
    const convertedReqBody = {
        input: {
            prompt: reqBody.prompt
        }
    }

    const response = await fetch(providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${providerKey}`
        },
        body: JSON.stringify(convertedReqBody)
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
        data: {
            url: data.output[0],
            revised_prompt: null,
            original_response_from_provider: data
        }
    }
    return convertedData
}
