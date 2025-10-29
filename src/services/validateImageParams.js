import { z } from 'zod'
import { imageModels } from '../shared/imageModels/index.js'
import { videoModels } from '../shared/videoModels/index.js'
import { extractWidthHeight } from './imageHelpers.js'
import { resolveModelAlias } from './modelAliases.js'

const bodySchema = z.object({
  prompt: z.string({
    invalid_type_error: "'prompt' must be a string"
  }).optional(),
  model: z.string({
    required_error: "'model' is a required parameter",
    invalid_type_error: "'model' must be a string"
  }).min(1, { message: "'model' is a required parameter" }),
  response_format: z.enum(['url', 'b64_json', 'b64_ephemeral']).default('url'),
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

  let { prompt, model, response_format, quality, size } = parseResult.data
  
  // Resolve model alias to real model name (if it's an alias)
  model = resolveModelAlias(model)
  
  const files = req.files || {}

  if (model === 'google/gemini-2.0-flash-exp:free') {
    throw new Error("Please switch to 'google/gemini-2.0-flash-exp' (paid) or 'google/gemini-2.5-flash:free' (free) instead.")
  }
  if (model === 'google/gemini-2.5-flash:free') {
    throw new Error("The free trial is over for this model. Please switch to 'google/gemini-2.5-flash' (paid) or use other models instead.")
  }
  if (model === 'stabilityai/sd3.5-medium') {
    throw new Error("This model is no longer available. Available alternative 'stabilityai/sd3.5'.")
  }
  

  const modelConfig = imageModels[model]
  if (!modelConfig) {
    if (videoModels[model]) {
      throw new Error(`'${model}' is a video model. Please use the video generation endpoint.`)
    }
    throw new Error(`model '${model}' is not available`)
  }
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
