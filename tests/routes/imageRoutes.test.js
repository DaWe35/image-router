import express from 'express'
import request from 'supertest'
import { imageRoutes } from '../../src/routes/imageRoutes.js'
import { generateImage } from '../../src/services/imageService.js'
import { models } from '../../src/shared/models/index.js'
import { validateParams } from '../../src/services/validateParams.js'
import { preLogUsage, refundUsage, postLogUsage } from '../../src/services/logUsage.js'

// Mock the dependencies
jest.mock('../../src/services/imageService.js')
jest.mock('../../src/services/validateParams.js')
jest.mock('../../src/services/logUsage.js')

describe('Image Routes', () => {
  let app

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()

    // Create a simple Express app with the image routes
    app = express()
    app.use(express.json())
    
    // Middleware to set res.locals.key for tests with 0 credits
    app.use((req, res, next) => {
      res.locals.key = {
        id: 'test-api-key',
        apiKeyTempJwt: false,
        user: {
          id: 'test-user-id',
          credits: 0, // 0 credits to ensure no credits are spent
          isActive: true
        }
      }
      next()
    })

    app.use('/v1/images', imageRoutes)
  })

  describe('GET /models', () => {
    it('should return available models', async () => {
      const response = await request(app)
        .get('/v1/images/models')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(response.body).toEqual(models)
    })
  })

  describe('POST /generations with free model', () => {
    const freeModelParams = {
      prompt: 'A beautiful sunset',
      model: 'flux-1-schnell-free' // Using a free model
    }

    const mockImageResult = {
      created: 1678912345,
      data: [
        {
          url: 'https://example.com/image.png',
          revised_prompt: 'A beautiful sunset over the ocean'
        }
      ],
      latency: 1500
    }

    beforeEach(() => {
      // Setup mocks with successful responses
      validateParams.mockReturnValue(freeModelParams)
      
      const mockUsageLogEntry = { 
        id: 'test-log-id',
        cost: 0 // 0 cost for free model
      }
      
      preLogUsage.mockResolvedValue(mockUsageLogEntry)
      generateImage.mockResolvedValue(mockImageResult)
      postLogUsage.mockResolvedValue(0) // 0 for free model
    })

    it('should generate an image with free model successfully', async () => {
      const response = await request(app)
        .post('/v1/images/generations')
        .send(freeModelParams)
        .expect('Content-Type', /json/)
        .expect(200)

      // Verify the response includes the expected image data and cost
      expect(response.body).toEqual({
        ...mockImageResult,
        cost: 0
      })

      // Verify all services were called with correct parameters
      expect(validateParams).toHaveBeenCalledWith(expect.objectContaining({
        body: freeModelParams
      }))
      
      expect(preLogUsage).toHaveBeenCalledWith(
        freeModelParams,
        expect.objectContaining({
          id: 'test-api-key',
          user: expect.objectContaining({
            id: 'test-user-id'
          })
        })
      )
      
      expect(generateImage).toHaveBeenCalledWith(
        freeModelParams,
        'test-user-id'
      )
      
      expect(postLogUsage).toHaveBeenCalledWith(
        freeModelParams,
        expect.any(Object),
        expect.any(Object),
        mockImageResult
      )
    })
  })

  describe('POST /generations with paid model', () => {
    const paidModelParams = {
      prompt: 'A beautiful sunset',
      model: 'dall-e-3' // Using a paid model
    }

    beforeEach(() => {
      // Setup mocks with validation passing but insufficient credits
      validateParams.mockReturnValue(paidModelParams)
      
      // Mock preLogUsage to throw insufficient credits error
      const creditError = new Error('Insufficient credits (this model needs minimum $0.5 credits), please topup your ImageRouter account: https://ir.myqa.cc/pricing')
      preLogUsage.mockRejectedValue(creditError)
    })

    it('should throw insufficient credits error for paid model with 0 credits', async () => {
      const response = await request(app)
        .post('/v1/images/generations')
        .send(paidModelParams)
        .expect('Content-Type', /json/)
        .expect(500)

      expect(response.body).toEqual({
        error: {
          message: expect.stringContaining('Insufficient credits'),
          type: 'internal_error'
        }
      })
      
      // Verify validation was called
      expect(validateParams).toHaveBeenCalled()
      
      // Verify preLogUsage was called
      expect(preLogUsage).toHaveBeenCalled()
      
      // Verify image generation was not attempted
      expect(generateImage).not.toHaveBeenCalled()
    })
  })

  describe('Error handling', () => {
    const validParams = {
      prompt: 'A beautiful sunset',
      model: 'flux-1-schnell-free' // Using a free model
    }

    it('should handle validation errors', async () => {
      // Setup mock to throw a validation error
      const validationError = new Error('Invalid parameters')
      validateParams.mockImplementation(() => {
        throw validationError
      })

      const response = await request(app)
        .post('/v1/images/generations')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400)

      expect(response.body).toEqual({
        error: {
          message: 'Invalid parameters',
          type: 'invalid_request_error'
        }
      })

      // Make sure subsequent services were not called
      expect(preLogUsage).not.toHaveBeenCalled()
      expect(generateImage).not.toHaveBeenCalled()
      expect(postLogUsage).not.toHaveBeenCalled()
    })

    it('should handle image generation errors', async () => {
      // Setup validation and preLogUsage to succeed
      validateParams.mockReturnValue(validParams)
      preLogUsage.mockResolvedValue({ id: 'test-usage-id', cost: 0 })
      
      // Setup mock for generation error
      const generationError = {
        status: 429,
        errorResponse: {
          error: {
            message: 'Rate limit exceeded',
            type: 'rate_limit_error'
          }
        }
      }
      
      generateImage.mockRejectedValue(generationError)

      const response = await request(app)
        .post('/v1/images/generations')
        .send(validParams)
        .expect('Content-Type', /json/)
        .expect(429)

      expect(response.body).toEqual(generationError.errorResponse)
      
      // Verify refundUsage was called
      expect(refundUsage).toHaveBeenCalled()
      expect(postLogUsage).not.toHaveBeenCalled()
    })

    it('should handle unexpected errors during image generation', async () => {
      // Setup validation and preLogUsage to succeed
      validateParams.mockReturnValue(validParams)
      preLogUsage.mockResolvedValue({ id: 'test-usage-id', cost: 0 })
      
      // Setup mock for unexpected error
      const unexpectedError = new Error('Unexpected error')
      generateImage.mockRejectedValue(unexpectedError)

      const response = await request(app)
        .post('/v1/images/generations')
        .send(validParams)
        .expect('Content-Type', /json/)
        .expect(500)

      expect(response.body).toEqual({
        error: {
          message: 'Unexpected error',
          type: 'internal_error'
        }
      })
      
      // Verify refundUsage was called
      expect(refundUsage).toHaveBeenCalled()
    })
  })
}) 