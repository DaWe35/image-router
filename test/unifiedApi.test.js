/**
 * Unified API Tests
 * 
 * These tests demonstrate the unified API format following Open Responses spec
 */

import { describe, test, expect } from '@jest/globals'
import { convertOpenResponsesToInternal, convertInternalToOpenResponses } from '../src/services/unifiedService.js'

describe('Unified API Format Conversion', () => {
  
  test('converts simple text-to-image request', () => {
    const openResponsesRequest = {
      model: 'openai/dall-e-3',
      messages: [
        {
          role: 'user',
          content: 'A serene mountain landscape'
        }
      ],
      size: '1024x1024',
      quality: 'hd'
    }

    const internal = convertOpenResponsesToInternal(openResponsesRequest)
    
    expect(internal.model).toBe('openai/dall-e-3')
    expect(internal.prompt).toBe('A serene mountain landscape')
    expect(internal.size).toBe('1024x1024')
    expect(internal.quality).toBe('hd')
  })

  test('converts multimodal image-to-image request', () => {
    const openResponsesRequest = {
      model: 'black-forest-labs/FLUX-2-dev',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Make it cyberpunk'
            },
            {
              type: 'image_url',
              image_url: {
                url: 'data:image/png;base64,abc123'
              }
            }
          ]
        }
      ]
    }

    const internal = convertOpenResponsesToInternal(openResponsesRequest)
    
    expect(internal.model).toBe('black-forest-labs/FLUX-2-dev')
    expect(internal.prompt).toBe('Make it cyberpunk')
    expect(internal.files.image).toHaveLength(1)
    expect(internal.files.image[0]).toBe('data:image/png;base64,abc123')
  })

  test('converts internal image result to Open Responses format', () => {
    const internalResult = {
      created: 1234567890,
      data: [
        {
          url: 'https://example.com/image.png',
          revised_prompt: null
        }
      ],
      cost: 0.04,
      latency: 3245
    }

    const openResponses = convertInternalToOpenResponses(internalResult, 'openai/dall-e-3')
    
    expect(openResponses.object).toBe('response')
    expect(openResponses.model).toBe('openai/dall-e-3')
    expect(openResponses.created).toBe(1234567890)
    expect(openResponses.items).toHaveLength(1)
    expect(openResponses.items[0].type).toBe('message')
    expect(openResponses.items[0].role).toBe('assistant')
    expect(openResponses.items[0].content).toHaveLength(1)
    expect(openResponses.items[0].content[0].type).toBe('image_url')
    expect(openResponses.items[0].content[0].image_url.url).toBe('https://example.com/image.png')
    expect(openResponses.usage.total_cost).toBe(0.04)
    expect(openResponses.usage.latency_ms).toBe(3245)
  })

  test('converts internal video result to Open Responses format', () => {
    const internalResult = {
      created: 1234567890,
      data: [
        {
          url: 'https://example.com/video.mp4',
          revised_prompt: null
        }
      ],
      cost: 1.75,
      latency: 45000
    }

    const openResponses = convertInternalToOpenResponses(internalResult, 'google/veo-2')
    
    expect(openResponses.items[0].content[0].type).toBe('video_url')
    expect(openResponses.items[0].content[0].video_url.url).toBe('https://example.com/video.mp4')
  })

  test('converts internal base64 image to Open Responses format', () => {
    const internalResult = {
      created: 1234567890,
      data: [
        {
          b64_json: 'iVBORw0KGgoAAAANS...',
          revised_prompt: null
        }
      ],
      cost: 0.02
    }

    const openResponses = convertInternalToOpenResponses(internalResult, 'openai/dall-e-2')
    
    expect(openResponses.items[0].content[0].type).toBe('image_url')
    expect(openResponses.items[0].content[0].image_url.url).toContain('data:image/png;base64,')
  })

  test('converts internal base64 video to Open Responses format', () => {
    const internalResult = {
      created: 1234567890,
      data: [
        {
          b64_json: 'data:video/mp4;base64,AAAAIGZ0eXBpc28...',
          revised_prompt: null
        }
      ],
      cost: 2.5
    }

    const openResponses = convertInternalToOpenResponses(internalResult, 'google/veo-3.1')
    
    expect(openResponses.items[0].content[0].type).toBe('video_url')
    expect(openResponses.items[0].content[0].video_url.url).toContain('data:video/mp4;base64,')
  })

  test('handles multiple output items', () => {
    const internalResult = {
      created: 1234567890,
      data: [
        { url: 'https://example.com/image1.png', revised_prompt: null },
        { url: 'https://example.com/image2.png', revised_prompt: null }
      ],
      cost: 0.08
    }

    const openResponses = convertInternalToOpenResponses(internalResult, 'openai/dall-e-3')
    
    expect(openResponses.items).toHaveLength(2)
    expect(openResponses.items[0].content[0].image_url.url).toBe('https://example.com/image1.png')
    expect(openResponses.items[1].content[0].image_url.url).toBe('https://example.com/image2.png')
  })

  test('handles max_items parameter', () => {
    const openResponsesRequest = {
      model: 'openai/dall-e-3',
      messages: [
        {
          role: 'user',
          content: 'A landscape'
        }
      ],
      max_items: 4
    }

    const internal = convertOpenResponsesToInternal(openResponsesRequest)
    
    expect(internal.n).toBe(4)
  })

  test('preserves extra model-specific parameters', () => {
    const openResponsesRequest = {
      model: 'google/veo-2',
      messages: [
        {
          role: 'user',
          content: 'A video'
        }
      ],
      seconds: 5,
      response_format: 'url'
    }

    const internal = convertOpenResponsesToInternal(openResponsesRequest)
    
    expect(internal.seconds).toBe(5)
    expect(internal.response_format).toBe('url')
  })

  test('generates unique IDs for items', () => {
    const internalResult = {
      created: 1234567890,
      data: [
        { url: 'https://example.com/1.png', revised_prompt: null },
        { url: 'https://example.com/2.png', revised_prompt: null }
      ],
      cost: 0.08
    }

    const openResponses = convertInternalToOpenResponses(internalResult, 'openai/dall-e-3')
    
    expect(openResponses.items[0].id).toBeDefined()
    expect(openResponses.items[1].id).toBeDefined()
    expect(openResponses.items[0].id).not.toBe(openResponses.items[1].id)
  })
})
