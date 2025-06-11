import { storageService } from '../src/services/storageService.js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'

const s3Mock = mockClient(S3Client)

beforeEach(() => {
  s3Mock.reset()
})

describe('StorageService', () => {
  test('uploadBase64 returns public url', async () => {
    process.env.S3_BUCKET_NAME = 'my-bucket'
    process.env.S3_REGION = 'us-east-1'
    process.env.S3_ENDPOINT = 'https://mock-s3.test'
    storageService.initializeS3Client()

    s3Mock.on(PutObjectCommand).resolves({})

    const base64 = Buffer.from('hello').toString('base64')
    const result = await storageService.uploadBase64(base64, 'image/png', '123')

    expect(result.url).toContain('/123.png')
    expect(s3Mock.calls()).toHaveLength(1)
  })
}) 