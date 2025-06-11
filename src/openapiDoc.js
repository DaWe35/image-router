import { z } from 'zod'
import { extendZodWithOpenApi, OpenAPIRegistry, generateOpenApiDocument } from '@asteasolutions/zod-to-openapi'
import { imageRequestSchema } from './services/validateImageParams.js'
import { videoRequestSchema } from './services/validateVideoParams.js'

extendZodWithOpenApi(z)

const registry = new OpenAPIRegistry()

// Schemas
const imageEditSchema = imageRequestSchema.extend({
  image: z.any().required(),
  mask: z.any().optional()
})
registry.register('ImageGenerationRequest', imageRequestSchema)
registry.register('VideoGenerationRequest', videoRequestSchema)
registry.register('ImageEditRequest', imageEditSchema)

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
          schema: imageEditSchema.openapi({ componentId: 'ImageEditRequest' })
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

export const openApiDocument = generateOpenApiDocument(registry, {
  openapi: '3.1.0',
  info: {
    title: 'Image Router API',
    version: '0.0.1'
  },
  servers: [
    { url: process.env.API_URL || 'http://localhost:3000' }
  ]
}) 