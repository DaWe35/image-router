/**
 * Utility to select a provider from the available list.
 *
 * For now this simply returns the first provider in the list, but keeping this
 * logic isolated in one place makes it easy to introduce more sophisticated
 * selection strategies (e.g. random, weighted, availability-based, user tier)
 * later without touching the callers.
 *
 * @template T
 * @param {T[]} providers - Ordered list of provider implementations.
 * @param {object} [options] - Optional selector parameters (reserved for future use).
 * @returns {number} Index of the selected provider in the `providers` array.
 */
export function selectProvider(providers, requestParams = {}) {
  if (!Array.isArray(providers) || providers.length === 0) {
    throw new Error('No providers supplied to selectProvider()');
  }

  // Detect model identifier (can be plain or namespaced like 'openai/gpt-image-1')
  const modelId = requestParams.model || '';

  // Heuristic to detect whether the caller supplied an input image (file upload or URL/B64)
  const hasInputImage = Boolean(
    requestParams.image ||
    (requestParams.files && (requestParams.files.image || requestParams.files['image[]']))
  );

  // Determine desired provider ID under special-case rules
  let desiredProviderId = providers[0].id;

  // Special-case selection for GPT-Image-1
  if (modelId === 'openai/gpt-image-1') {
    // If an input image is provided we need the OpenAI provider (supports edits),
    // otherwise we prefer NanoGPT which is cheaper for pure text-to-image.
    desiredProviderId = hasInputImage ? 'openai' : 'nanogpt';
  }

  // Find index of desired provider; fallback to 0 if not found
  const idx = providers.findIndex(p => p.id === desiredProviderId);
  return idx === -1 ? 0 : idx;
}

export default selectProvider;
