import fetch from 'node-fetch'

const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations'
const DEEPINFRA_API_URL = 'https://api.deepinfra.com/v1/openai/images/generations'

const PROVIDERS = {
  'dall-e-2': 'openai',
  'dall-e-3': 'openai',
  'stabilityai/sdxl-turbo': 'deepinfra'
}

export async function generateImage({ prompt, n, size, model }) {
  const provider = PROVIDERS[model]
  
  if (!provider) {
    throw new Error('Invalid model specified')
  }

  if (provider === 'openai') {
    return generateOpenAI({ prompt, n, size, model })
  } else {
    return generateDeepInfra({ prompt, n, size })
  }
}

async function generateOpenAI({ prompt, n, size, model }) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OpenAI API key is not configured')
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt,
      n,
      size,
      model
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw error
  }

  const data = await response.json()
  return data
}

async function generateDeepInfra({ prompt, n, size }) {
  const apiKey = process.env.DEEPINFRA_API_KEY

  if (!apiKey) {
    throw new Error('DeepInfra API key is not configured')
  }

  const response = await fetch(DEEPINFRA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        num_inference_steps: 50,
        guidance_scale: 7.5,
        width: parseInt(size.split('x')[0]),
        height: parseInt(size.split('x')[1])
      }
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw error
  }

  const data = await response.json()
  
  // Transform DeepInfra response to match OpenAI format
  return {
    created: Math.floor(Date.now() / 1000),
    data: data.images.map(image => ({
      url: image,
      revised_prompt: prompt
    }))
  }
} 