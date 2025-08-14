import { z } from 'zod'
import { extendZodWithOpenApi, OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi'
import { imageRequestSchema } from './services/validateImageParams.js'
import { videoRequestSchema } from './services/validateVideoParams.js'

// Attach the .openapi() helper to Zod
extendZodWithOpenApi(z)

const registry = new OpenAPIRegistry()

// Schemas
const imageWithUploadsSchema = imageRequestSchema.extend({
  image: z.string().openapi({ type: 'string', format: 'binary' }).optional(),
  'image[]': z.string().openapi({ type: 'string', format: 'binary' }).optional(),
  mask: z.string().openapi({ type: 'string', format: 'binary' }).optional(),
  'mask[]': z.string().openapi({ type: 'string', format: 'binary' }).optional()
}).openapi('ImageGenerationWithUploads')
registry.register('ImageGenerationRequest', imageRequestSchema)
registry.register('VideoGenerationRequest', videoRequestSchema)
// Video generation with optional image upload (multipart)
const videoGenerationWithImageSchema = videoRequestSchema.extend({
  image: z.string().openapi({ type: 'string', format: 'binary' }).optional(),
  'image[]': z.string().openapi({ type: 'string', format: 'binary' }).optional()
}).openapi('VideoGenerationWithImageRequest')

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
        },
        'multipart/form-data': {
          schema: imageWithUploadsSchema
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
        },
        'multipart/form-data': {
          schema: videoGenerationWithImageSchema
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
        'application/json': {
          schema: imageRequestSchema
        },
        'multipart/form-data': {
          schema: imageWithUploadsSchema
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
  method: 'get',
  path: '/v1/models',
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