import { z } from 'zod'
import { videoModels } from '../shared/videoModels/index.js'

const bodySchema = z.object({
  prompt: z.string().min(1, { message: "'prompt' is a required parameter" }),
  model: z.string().min(1, { message: "'model' is a required parameter" }),
  response_format: z.enum(['url', 'b64_json']).default('url'),
})

// Validate the parameters for the video generation request and return only the valid parameters
export function validateVideoParams(req) {
    const parseResult = bodySchema.safeParse(req.body)
    if (!parseResult.success) {
        throw new Error(parseResult.error.errors[0].message)
    }

    const { prompt, model, response_format } = parseResult.data

    // Validate model parameter and config
    const modelConfig = videoModels[model]
    if (!modelConfig) throw new Error(`model '${model}' is not available`)
    if (!modelConfig?.providers[0]?.id) throw new Error(`model provider for '${model}' is not available`)

    const files = req.files || {}

    // Validate image uploads (single image only for now)
    const validFiles = {}
    if (files.image) {
        if (Array.isArray(files.image) && files.image.length > 1) {
            throw new Error('Maximum of 1 image can be uploaded for video generation')
        }
        validFiles.image = Array.isArray(files.image) ? files.image[0] : files.image
    }
    
    // Additional validation – certain models require an image input
    const modelsRequiringImage = ['kwaivgi/kling-v2.1-standard', 'kwaivgi/kling-v2.1-pro']
    if (modelsRequiringImage.includes(model) && !validFiles.image) {
        throw new Error(`'image' is a required input parameter for model '${model}'`)
    }

    return { prompt, model, response_format, files: validFiles }
}

export const videoRequestSchema = bodySchema 