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

    return { prompt, model, response_format }
}

export const videoRequestSchema = bodySchema 