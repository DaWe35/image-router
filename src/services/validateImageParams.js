import { z } from 'zod'
import { imageModels } from '../shared/imageModels/index.js'
import { extractWidthHeight } from './imageHelpers.js'

const bodySchema = z.object({
  prompt: z.string({
    required_error: "'prompt' is a required parameter",
    invalid_type_error: "'prompt' must be a string"
  }).min(1, { message: "'prompt' is a required parameter" }),
  model: z.string({
    required_error: "'model' is a required parameter",
    invalid_type_error: "'model' must be a string"
  }).min(1, { message: "'model' is a required parameter" }),
  response_format: z.enum(['url', 'b64_json']).default('url'),
  quality: z.enum(['auto', 'low', 'medium', 'high']).default('auto'),
  // Allow explicit 'auto' or dimensions like "1024x768"
  size: z.string()
    .default('auto')
    .refine(val => val === 'auto' || /^\d+x\d+$/.test(val), {
      message: "'size' must be 'auto' or in the format 'WIDTHxHEIGHT' (e.g. '1024x768')"
    })
})

export function validateImageParams(req) {
  const parseResult = bodySchema.safeParse(req.body)
  if (!parseResult.success) {
    throw new Error(parseResult.error.errors[0].message)
  }

  const { prompt, model, response_format, quality, size } = parseResult.data
  const files = req.files || {}

  if (model === 'google/gemini-2.0-flash-prev') {
    throw new Error("'google/gemini-2.0-flash-prev' is temporary disabled. Please use 'google/gemini-2.0-flash-exp' instead.")
  }

  const modelConfig = imageModels[model]
  if (!modelConfig) throw new Error(`model '${model}' is not available`)
  if (!modelConfig?.providers[0]?.id) throw new Error(`model provider for '${model}' is not available`)

  // Restrict size for free tier models
  if (model.endsWith(':free')) {
    const { width, height } = extractWidthHeight(size)
    if (width > 1024 || height > 1024) {
      throw new Error('Free models support maximum size of 1024x1024. Please use the paid models for higher quality.')
    }
  }

  // Validate files
  const validFiles = {}
  if (files.image) {
    const images = Array.isArray(files.image) ? files.image : [files.image]
    if (images.length > 16) throw new Error('Maximum of 16 images can be uploaded')
    validFiles.image = images
  }
  if (files.mask) {
    validFiles.mask = Array.isArray(files.mask) ? files.mask[0] : files.mask
  }

  return { prompt, model, response_format, quality, size, files: validFiles }
}

export const imageRequestSchema = bodySchema
