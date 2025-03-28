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
            break
        case 'deepinfra':
            providerUrl = 'https://api.deepinfra.com/v1/openai/images/generations'
            providerKey = process.env.DEEPINFRA_API_KEY
            break
    }

    return generateOpenAI({ providerUrl, providerKey, reqBody })
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
