import { z } from 'zod'
import { videoModels } from '../shared/videoModels/index.js'
import { imageModels } from '../shared/imageModels/index.js'

const bodySchema = z.object({
  prompt: z.string({
    invalid_type_error: "'prompt' must be a string"
  }).optional(),
  model: z.string().min(1, { message: "'model' is a required parameter" }),
  response_format: z.enum(['url', 'b64_json', 'b64_ephemeral']).default('url'),
  size: z.string()
    .default('auto')
    .refine(val => val === 'auto' || /^\d+x\d+$/.test(val), {
      message: "'size' must be 'auto' or in the format 'WIDTHxHEIGHT' (e.g. '1024x768')"
    })})

// Validate the parameters for the video generation request and return only the valid parameters
export function validateVideoParams(req) {
    const parseResult = bodySchema.safeParse(req.body)
    if (!parseResult.success) {
        throw new Error(parseResult.error.errors[0].message)
    }

    const { prompt, model, response_format, size } = parseResult.data

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
    
    // Additional validation – certain models require an image input
    const modelsRequiringImage = ['kwaivgi/kling-2.1-standard', 'kwaivgi/kling-2.1-pro']
    if (modelsRequiringImage.includes(model) && !validFiles.image) {
        throw new Error(`'image' is a required input parameter for model '${model}'`)
    }

    return { prompt, model, response_format, size, files: validFiles }
}

export const videoRequestSchema = bodySchema 