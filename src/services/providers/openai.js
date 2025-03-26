const { ApiError } = require('../../utils/errors')

const processOpenAIRequest = async (imageRequest, provider) => {
  try {
    const { prompt, n, size, response_format } = imageRequest
    const { apiKey, baseUrl } = provider

    const response = await fetch(`${baseUrl}/v1/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        n,
        size,
        response_format
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new ApiError({
        statusCode: response.status,
        type: 'provider_error',
        message: error.error?.message || 'OpenAI API error',
        details: error.error
      })
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError({
      statusCode: 503,
      type: 'provider_error',
      message: 'Error processing OpenAI request',
      details: error.message
    })
  }
}

module.exports = {
  processOpenAIRequest
} 