import { z } from 'zod'
import { extendZodWithOpenApi, OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi'
import { imageRequestSchema } from './services/validateImageParams.js'
import { videoRequestSchema } from './services/validateVideoParams.js'

// Attach the .openapi() helper to Zod
extendZodWithOpenApi(z)

const registry = new OpenAPIRegistry()

// Schemas
const imageEditSchema = imageRequestSchema.extend({
  image: z.any(),
  mask: z.any().optional()
})
.openapi('ImageEditRequest')
registry.register('ImageGenerationRequest', imageRequestSchema)
registry.register('VideoGenerationRequest', videoRequestSchema)

// Paths
registry.registerPath({
  method: 'post',
  path: '/v1/openai/images/generations',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: imageRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Success'
    }
  }
})

registry.registerPath({
  method: 'post',
  path: '/v1/openai/videos/generations',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: videoRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Success'
    }
  }
})

registry.registerPath({
  method: 'post',
  path: '/v1/openai/images/edits',
  request: {
    body: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: imageEditSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Success'
    }
  }
})

const generator = new OpenApiGeneratorV31(registry.definitions)

export const openApiDocument = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'Image Router API',
    version: '0.0.1'
  },
  servers: [
    { url: process.env.API_URL || 'http://localhost:3000' }
  ]
}) 