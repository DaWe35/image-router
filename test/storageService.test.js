import { jest } from '@jest/globals'

// Mock AWS SDK v3 S3 client
jest.unstable_mockModule('@aws-sdk/client-s3', () => {
  const mockSend = jest.fn().mockResolvedValue({})
  class MockS3Client {
    constructor() {}
    send = mockSend
    destroy = jest.fn()
  }
  const PutObjectCommand = class {}
  return {
    S3Client: MockS3Client,
    PutObjectCommand
  }
})

// Mock Upload class to bypass internal multi-part logic
jest.unstable_mockModule('@aws-sdk/lib-storage', () => {
  const Upload = class {
    constructor() {}
    done = jest.fn().mockResolvedValue({})
  }
  return { Upload }
})

// Now import after mocks
const { storageService } = await import('../src/services/storageService.js')

describe('StorageService', () => {
  beforeAll(() => {
    process.env.S3_ACCESS_KEY_ID = 'dummy-key'
    process.env.S3_SECRET_ACCESS_KEY = 'dummy-secret'
    process.env.S3_BUCKET_NAME = 'my-bucket'
    process.env.S3_REGION = 'us-east-1'
    process.env.S3_ENDPOINT = 'https://mock-s3.test'
    storageService.initializeS3Client()
  })

  afterAll(() => {
    if (storageService.s3Client?.destroy) storageService.s3Client.destroy()
  })

  test('uploadBase64 returns public url and calls putObject', async () => {
    const base64 = Buffer.from('hello').toString('base64')
    const result = await storageService.uploadBase64(base64, 'image/png', '123')

    expect(result.url).toContain('/123.png')
  })
}) 