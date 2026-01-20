/**
 * Model Aliases System
 * 
 * Aliases work as redirects - when a user invokes an alias, it's automatically
 * translated to the real model name. The real model name is used everywhere
 * (validation, logging, generation, etc.) - not the alias.
 * 
 * Example: User calls 'briaai/RMBG-2.0' -> System uses 'bria/RMBG-2.0'
 */

const MODEL_ALIASES = {
  // Bria aliases (company name variation)
  'briaai/RMBG-2.0': 'bria/remove-background',
  'briaai/RMBG-2.0:free': 'bria/remove-background:free',
  'google/gemini-2.5-flash-image': 'google/gemini-2.5-flash',
  'gemini-2.5-flash-image': 'google/gemini-2.5-flash',
  'google/gemini-3-pro-image': 'google/gemini-3-pro',
  'gemini-3-pro-image': 'google/gemini-3-pro',
  // Add more aliases here as needed
  // 'alias-name': 'real-model-name',
}

/**
 * Resolves a model alias to its real model name.
 * If no alias exists, returns the original model name.
 * 
 * @param {string} modelName - The model name or alias to resolve
 * @returns {string} The real model name
 */
export function resolveModelAlias(modelName) {
  if (!modelName) return modelName
  return MODEL_ALIASES[modelName] || modelName
}

/**
 * Checks if a given model name is an alias.
 * 
 * @param {string} modelName - The model name to check
 * @returns {boolean} True if it's an alias, false otherwise
 */
export function isAlias(modelName) {
  return modelName in MODEL_ALIASES
}

/**
 * Gets all registered aliases.
 * 
 * @returns {Object} Map of aliases to real model names
 */
export function getAllAliases() {
  return { ...MODEL_ALIASES }
}

export default { resolveModelAlias, isAlias, getAllAliases }
