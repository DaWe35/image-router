import { validateImageParams } from '../src/services/validateImageParams.js'
import { validateVideoParams } from '../src/services/validateVideoParams.js'

// Mock minimal image/video models so validators succeed
jest.unstable_mockModule('../src/shared/imageModels/index.js', () => ({
  imageModels: {
    'provider/model1': { providers: [{ id: 'mock', model_name: 'provider/model1' }] }
  }
}))
jest.unstable_mockModule('../src/shared/videoModels/index.js', () => ({
  videoModels: {
    'provider/video-model': { providers: [{ id: 'mock', model_name: 'provider/video-model' }] }
  }
}))

// Re-import after mocks
const { validateImageParams: validateImage } = await import('../src/services/validateImageParams.js')
const { validateVideoParams: validateVideo } = await import('../src/services/validateVideoParams.js')

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
}) 