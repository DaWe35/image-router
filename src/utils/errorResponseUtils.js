const FREE_MODEL_STABILITY_HINT =
  'Paid models are usually more stable because they use multi-provider routing.'

/**
 * If the request was for a free model, append a hint to the error message
 * suggesting paid models for better stability (multi-provider routing).
 * Mutates response in place when applicable.
 *
 * @param {object} response - The error response object to send (e.g. { error: { message, type } }).
 * @param {string} [model] - The model name from the request (e.g. 'google/gemini-2.5-flash:free').
 */
export function addFreeModelStabilityHint(response, model) {
  if (typeof model !== 'string' || !model.includes(':free')) return
  if (!response?.error || typeof response.error !== 'object') return
  const msg = response.error.message || ''
  response.error.message = msg ? `${msg} ${FREE_MODEL_STABILITY_HINT}` : FREE_MODEL_STABILITY_HINT
}
