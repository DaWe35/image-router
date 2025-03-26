import fetch from 'node-fetch'

const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations'

export async function generateImage({ prompt, n, size, model }) {
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
    throw new Error(error.error?.message || 'Failed to generate image')
  }

  const data = await response.json()
  return data
} 