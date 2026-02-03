import { z } from 'zod'
import { videoModels } from '../shared/videoModels/index.js'
import { imageModels } from '../shared/imageModels/index.js'
import { resolveModelAlias } from './modelAliases.js'

const bodySchema = z.object({
  prompt: z.string({
    invalid_type_error: "'prompt' must be a string"
  }).max(10000, { message: "'prompt' must be 10,000 characters or less. Please contact ImageRouter support if you need a higher limit." }).optional(),
  model: z.string().min(1, { message: "'model' is a required parameter" }),
  response_format: z.enum(['url', 'b64_json', 'b64_ephemeral']).default('url'),
  quality: z.enum(['auto', 'low', 'medium', 'high']).default('auto'),
  size: z.string()
    .default('auto')
    .refine(val => val === 'auto' || /^\d+([xX×*])\d+$/.test(val), {
      message: "'size' must be 'auto' or in the format 'WIDTHxHEIGHT' (e.g. '1024x768')"
    }),
  seconds: z.union([
    z.literal('auto'),
    z.coerce.number({
      invalid_type_error: "'seconds' must be a number"
    }).min(1, { message: "'seconds' must be at least 1" }).max(60, { message: "'seconds' must be 60 or less" })
  ]).default('auto')
})

// Validate the parameters for the video generation request and return only the valid parameters
export function validateVideoParams(req) {
    const parseResult = bodySchema.safeParse(req.body)
    if (!parseResult.success) {
        throw new Error(parseResult.error.errors[0].message)
    }

    let { prompt, model, response_format, quality, size, seconds } = parseResult.data
    
    // Resolve model alias to real model name (if it's an alias)
    model = resolveModelAlias(model)

    // Validate model parameter and config
    const modelConfig = videoModels[model]
    if (!modelConfig) {
        if (imageModels[model]) {
            throw new Error(`'${model}' is an image model. Please use the image generation endpoint.`)
        }
        throw new Error(`model '${model}' is not available`)
    }
    if (!modelConfig?.providers[0]?.id) throw new Error(`model provider for '${model}' is not available`)

    const files = req.files || {}

    // Validate image uploads (single image only for now)
    const validFiles = {}
    if (files.image) {
        validFiles.image = Array.isArray(files.image) ? files.image[0] : files.image
    }

    return { prompt, model, response_format, quality, size, seconds, files: validFiles }
}

export const videoRequestSchema = bodySchema 