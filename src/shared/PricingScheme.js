/**
 * Standard pricing types for image generation models
 */
const PRICING_TYPES = {
  // Fixed price per image, regardless of size/quality
  FIXED: 'fixed',
  
  // Price calculated based on quality/size/parameters
  CALCULATED: 'calculated',
  
  // Price determined after generation (not calculable beforehand)
  POST_GENERATION: 'post_generation'
}

export { PRICING_TYPES } 