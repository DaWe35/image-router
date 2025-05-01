import {jest} from '@jest/globals'
import { generateImage } from '../../src/services/imageService.js'

// Mock fetch
const fetch = jest.fn()

// Mock dependencies
jest.mock('node-fetch', () => ({
  __esModule: true,
  default: fetch
}))
jest.mock('../../src/shared/models/index.js', () => ({
  models: {
    'test-model': {
      providers: [{ id: 'test-provider' }]
    },
    'invalid-model': {
      providers: [{ id: null }]
    },
    'openai-model': {
      providers: [{ 
        id: 'openai',
        applyQuality: (params, quality) => {
          params.quality = quality
          return params
        } 
      }],
      aliasOf: null
    },
    'openai-alias': {
      providers: [{ id: 'openai' }],
      aliasOf: 'openai/gpt-image-1'
    },
    'deepinfra-model': {
      providers: [{ id: 'deepinfra' }],
      aliasOf: null
    },
    'replicate-model': {
      providers: [{ id: 'replicate' }],
      aliasOf: null
    },
    'google-model': {
      providers: [{ id: 'google' }],
      aliasOf: null
    }
  }
}))

// Save the original process.env and mock it for tests
const originalEnv = process.env

describe('generateImage', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    
    // Mock process.env
    process.env = { 
      ...originalEnv,
      OPENAI_API_KEY: 'test-openai-key',
      DEEPINFRA_API_KEY: 'test-deepinfra-key',
      REPLICATE_API_KEY: 'test-replicate-key',
      GOOGLE_GEMINI_API_KEY: 'test-google-key'
    }
    
    // Setup fetch mock with successful response
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        created: 1678912345,
        data: [{ url: 'https://example.com/image.png' }]
      })
    }
    fetch.mockResolvedValue(mockResponse)
  })
  
  afterEach(() => {
    // Restore original process.env
    process.env = originalEnv
  })

  it('should throw an error for invalid model', async () => {
    const params = {
      prompt: 'Test prompt',
      model: 'invalid-model'
    }
    
    await expect(generateImage(params, 'test-user')).rejects.toThrow('Invalid model specified')
  })

  it('should apply quality parameter if available', async () => {
    const params = {
      prompt: 'Test prompt',
      model: 'openai-model',
      quality: 'high'
    }
    
    await generateImage(params, 'test-user')
    
    // Check if the fetch was called with the quality parameter
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('quality')
      })
    )
  })

  it('should use alias model if specified', async () => {
    const params = {
      prompt: 'Test prompt',
      model: 'openai-alias'
    }
    
    await generateImage(params, 'test-user')
    
    // Check if the fetch was called with the aliased model
    const fetchCall = fetch.mock.calls[0]
    const bodyContent = JSON.parse(fetchCall[1].body)
    expect(bodyContent.model).toBe('gpt-image-1')
  })
  
  it('should throw an error if provider response is not OK', async () => {
    // Mock fetch to return an error response
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        error: {
          message: 'Invalid request',
          type: 'invalid_request_error'
        }
      })
    })
    
    const params = {
      prompt: 'Test prompt',
      model: 'openai-model'
    }
    
    await expect(generateImage(params, 'test-user')).rejects.toEqual({
      status: 400,
      errorResponse: expect.objectContaining({
        error: expect.objectContaining({
          message: 'Invalid request'
        })
      })
    })
  })
  
  it('should return the image result with latency information', async () => {
    const params = {
      prompt: 'Test prompt',
      model: 'openai-model'
    }
    
    const result = await generateImage(params, 'test-user')
    
    expect(result).toMatchObject({
      created: expect.any(Number),
      data: expect.arrayContaining([
        expect.objectContaining({
          url: expect.any(String)
        })
      ]),
      latency: expect.any(Number)
    })
  })
  
  // Additional tests for different providers
  it('should call OpenAI provider correctly', async () => {
    const params = {
      prompt: 'Test prompt',
      model: 'openai-model'
    }
    
    await generateImage(params, 'test-user')
    
    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/images/generations',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-openai-key'
        })
      })
    )
  })
  
  it('should call DeepInfra provider correctly', async () => {
    const params = {
      prompt: 'Test prompt',
      model: 'deepinfra-model'
    }
    
    await generateImage(params, 'test-user')
    
    expect(fetch).toHaveBeenCalledWith(
      'https://api.deepinfra.com/v1/openai/images/generations',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-deepinfra-key'
        })
      })
    )
  })
  
  it('should call Replicate provider correctly', async () => {
    const params = {
      prompt: 'Test prompt',
      model: 'replicate-model'
    }
    
    await generateImage(params, 'test-user')
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.replicate.com/v1/models/'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-replicate-key'
        })
      })
    )
  })
  
  it('should call Google provider correctly', async () => {
    const params = {
      prompt: 'Test prompt',
      model: 'google-model'
    }
    
    await generateImage(params, 'test-user')
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://generativelanguage.googleapis.com/v1beta/models/'),
      expect.any(Object)
    )
  })
}) 