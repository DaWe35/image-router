import {jest} from '@jest/globals'
import { validateParams } from '../../src/services/validateParams.js'
import { models } from '../../src/shared/models/index.js'

// Mock the models module
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

describe('validateParams', () => {
  it('should validate correct parameters', () => {
    const req = {
      body: {
        prompt: 'Test prompt',
        model: 'test-model'
      }
    }

    const result = validateParams(req)
    expect(result).toEqual({
      prompt: 'Test prompt',
      model: 'test-model',
      quality: undefined
    })
  })

  it('should throw an error when prompt is missing', () => {
    const req = {
      body: {
        model: 'test-model'
      }
    }

    expect(() => validateParams(req)).toThrow("'prompt' is a required parameter")
  })

  it('should throw an error when model is missing', () => {
    const req = {
      body: {
        prompt: 'Test prompt'
      }
    }

    expect(() => validateParams(req)).toThrow("'model' is a required parameter")
  })

  it('should throw an error for unavailable model', () => {
    const req = {
      body: {
        prompt: 'Test prompt',
        model: 'non-existent-model'
      }
    }

    expect(() => validateParams(req)).toThrow("model 'non-existent-model' is not available")
  })

  it('should throw an error when model provider is not available', () => {
    const req = {
      body: {
        prompt: 'Test prompt',
        model: 'invalid-model'
      }
    }

    expect(() => validateParams(req)).toThrow("model provider for 'invalid-model' is not available")
  })

  it('should throw an error when response_format is provided', () => {
    const req = {
      body: {
        prompt: 'Test prompt',
        model: 'test-model',
        response_format: 'url'
      }
    }

    expect(() => validateParams(req)).toThrow("'response_format' is not yet supported")
  })

  it('should throw an error when size is provided', () => {
    const req = {
      body: {
        prompt: 'Test prompt',
        model: 'test-model',
        size: '1024x1024'
      }
    }

    expect(() => validateParams(req)).toThrow("'size' is not yet supported")
  })

  it('should validate and convert quality parameter to lowercase', () => {
    const req = {
      body: {
        prompt: 'Test prompt',
        model: 'test-model',
        quality: 'HIGH'
      }
    }

    const result = validateParams(req)
    expect(result.quality).toBe('high')
  })

  it('should throw an error for invalid quality value', () => {
    const req = {
      body: {
        prompt: 'Test prompt',
        model: 'test-model',
        quality: 'invalid'
      }
    }

    expect(() => validateParams(req)).toThrow("'quality' must be 'auto', 'low', 'medium', or 'high'")
  })
}) 