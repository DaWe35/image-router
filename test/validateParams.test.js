import { jest } from '@jest/globals'

// Mock minimal image/video models so validators succeed
jest.unstable_mockModule('../src/shared/imageModels/index.js', () => ({
  imageModels: {
    'provider/model1': { providers: [{ id: 'mock', model_name: 'provider/model1' }] },
    'bria/remove-background': { providers: [{ id: 'mock', model_name: 'bria/remove-background' }] }
  }
}))

jest.unstable_mockModule('../src/shared/videoModels/index.js', () => ({
  videoModels: {
    'provider/video-model': { providers: [{ id: 'mock', model_name: 'provider/video-model' }] }
  }
}))

// Dynamic import after mocks are set up
const { validateImageParams: validateImage } = await import('../src/services/validateImageParams.js')
const { validateVideoParams: validateVideo } = await import('../src/services/validateVideoParams.js')
const { resolveModelAlias } = await import('../src/services/modelAliases.js')

describe('Parameter validators', () => {
  test('image validator supplies default response_format', () => {
    const req = { body: { prompt: 'hi', model: 'provider/model1' }, files: {} }
    const result = validateImage(req)
    expect(result.response_format).toBe('url')
  })

  test('video validator supplies default response_format', () => {
    const req = { body: { prompt: 'hello', model: 'provider/video-model' } }
    const result = validateVideo(req)
    expect(result.response_format).toBe('url')
  })

  test('image validator rejects unknown quality', () => {
    const req = { body: { prompt: 'x', model: 'provider/model1', quality: 'ultra' }, files: {} }
    expect(() => validateImage(req)).toThrow()
  })

  test('resolveModelAlias resolves alias to real model name', () => {
    expect(resolveModelAlias('briaai/RMBG-2.0')).toBe('bria/remove-background')
  })

  test('resolveModelAlias returns original model name if no alias exists', () => {
    expect(resolveModelAlias('provider/model1')).toBe('provider/model1')
  })

  test('image validator resolves model alias to real model', () => {
    const req = { body: { prompt: 'remove background', model: 'briaai/RMBG-2.0' }, files: {} }
    const result = validateImage(req)
    expect(result.model).toBe('bria/remove-background')
  })
}) 