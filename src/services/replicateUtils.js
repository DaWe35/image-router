export async function pollReplicatePrediction(getUrl, providerKey, {
  pollingInterval = 5000, // milliseconds between polls
  maxAttempts = 240 // ~20 minutes total
} = {}) {
  let attempts = 0
  let lastData = null
  while (attempts < maxAttempts) {
    // Wait before first poll only if this is not the first loop iteration
    if (attempts > 0) {
      await new Promise(resolve => setTimeout(resolve, pollingInterval))
    }

    const res = await fetch(getUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${providerKey}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json()
    lastData = data

    if (!res.ok) {
      const formattedError = {
        status: data?.status || res.status,
        statusText: data?.detail || res.statusText,
        error: {
          message: data?.detail || 'Unknown error while polling prediction',
          type: data?.status || 'polling_error'
        },
        original_response_from_provider: data
      }
      throw {
        status: res.status,
        errorResponse: formattedError
      }
    }

    // Terminal states
    if (data.status === 'succeeded') {
      return data
    }
    if (data.status === 'failed' || data.status === 'canceled') {
      const formattedError = {
        status: data.status,
        statusText: data.error || 'Prediction did not succeed',
        error: {
          message: data.error || 'Prediction failed',
          type: data.status
        },
        original_response_from_provider: data
      }
      throw {
        status: 500,
        errorResponse: formattedError
      }
    }

    attempts += 1
  }

  // If we reach here, the prediction is still not finished after maxAttempts (timeout)
  // Do NOT throw, instead return the last known prediction state with a timeout status so that
  // upstream code can decide how to handle billing without triggering a full refund.
  const timeoutResponse = {
    ...(lastData || {}),
    status: 'timeout',
    error: 'Prediction polling timed out'
  }
  return timeoutResponse
}