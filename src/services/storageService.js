import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

class StorageService {
    constructor() {
        this.s3Client = null
        this.bucketName = process.env.S3_BUCKET_NAME
        this.region = process.env.S3_REGION
        this.endpoint = process.env.S3_ENDPOINT
        this.publicUrl = process.env.S3_CUSTOM_PUBLIC_URL
        
        this.initializeS3Client()
    }

    initializeS3Client() {
        if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
            console.warn('S3 credentials not provided. Storage service will be disabled.')
            return
        }

        const config = {
            region: this.region,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
            },
            requestChecksumCalculation: 'WHEN_REQUIRED', // backblaze b2 doesn't support checksums
            responseChecksumValidation: 'WHEN_REQUIRED', // backblaze b2 doesn't support checksums
            useAccelerateEndpoint: false,
            useGlobalEndpoint: false
        }

        if (this.endpoint) {
            config.endpoint = this.endpoint
            config.forcePathStyle = true
        }

        this.s3Client = new S3Client(config)
    }

    isEnabled() {
        return this.s3Client !== null && this.bucketName && this.region
    }

    generateFileName(contentType, usageLogId) {
        if (!usageLogId) {
            throw new Error('usageLogId is required for file naming')
        }
        const extension = this.getExtensionFromContentType(contentType)
        return `${usageLogId}${extension}`
    }

    getExtensionFromContentType(contentType) {
        const typeMap = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp',
            'image/gif': '.gif',
            'image/svg+xml': '.svg',
            'video/mp4': '.mp4',
            'video/webm': '.webm',
            'video/quicktime': '.mov'
        }
        return typeMap[contentType] || ''
    }

    // Internal helper that handles the actual PutObject request. Accepts Buffer or stream.
    async _uploadBody(body, contentType, usageLogId) {
        const fileName = this.generateFileName(contentType, usageLogId)

        const uploadParams = {
            Bucket: this.bucketName,
            Key: fileName,
            Body: body,
            ContentType: contentType
        }

        const upload = new Upload({
            client: this.s3Client,
            params: uploadParams
        })
        await upload.done()

        // If we were passed a Buffer we want to preserve it for b64_json fallback
        const maybeBuffer = Buffer.isBuffer(body) ? body : null

        const publicUrl = this.publicUrl
            ? `${this.publicUrl}/${fileName}`
            : `${this.endpoint}/${this.bucketName}/${fileName}`

        return {
            success: true,
            url: publicUrl,
            buffer: maybeBuffer
        }
    }

    async downloadAndUpload(url, contentType, usageLogId) {
        if (!this.isEnabled()) {
            throw new Error('Storage service is not configured')
        }

        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`Failed to download content: ${response.statusText}`)
            }

            // Directly stream response body to S3 to save memory
            if (response.body) {
                return await this._uploadBody(response.body, contentType, usageLogId)
            }

            // Fallback to buffering if body stream not available (older node-fetch versions)
            const buffer = await response.buffer()
            return await this._uploadBody(buffer, contentType, usageLogId)
        } catch (error) {
            console.error('Storage upload error:', error)
            throw new Error(`Failed to upload to storage: ${error.message}`)
        }
    }

    async uploadBase64(base64Data, contentType, usageLogId) {
        if (!this.isEnabled()) {
            throw new Error('Storage service is not configured')
        }

        try {
            const base64Content = base64Data.replace(/^data:[^;]+;base64,/, '')
            if (!base64Content) {
                throw new Error('Invalid base64 data: empty content')
            }
            const buffer = Buffer.from(base64Content, 'base64')
            return await this._uploadBody(buffer, contentType, usageLogId)
        } catch (error) {
            console.error('Storage upload error:', error)
            throw new Error(`Failed to upload base64 to storage: ${error.message}`)
        }
    }

    async processContent(content, responseFormat = 'url', usageLogId) {
        if (!this.isEnabled()) {
            return content
        }

        try {
            if (!content.url && !content.b64_json) {
                return content
            }

            let uploadResult

            if (content.url) {
                const contentType = this.detectContentType(content.url)
                uploadResult = await this.downloadAndUpload(content.url, contentType, usageLogId)
            } else if (content.b64_json) {  
                const contentType = this.detectContentTypeFromBase64(content.b64_json)
                uploadResult = await this.uploadBase64(content.b64_json, contentType, usageLogId)
            }

            if (responseFormat === 'b64_json') {
                // Use the buffer from upload result instead of re-downloading
                const base64Data = uploadResult.buffer ? uploadResult.buffer.toString('base64') : content.b64_json
                const result = {
                    ...content,
                    b64_json: base64Data,
                    // Always preserve the uploaded URL for logging purposes
                    _uploadedUrl: uploadResult.url
                }
                delete result.url
                return result
            } else {
                const result = {
                    ...content,
                    url: uploadResult.url
                }
                delete result.b64_json
                return result
            }
        } catch (error) {
            console.error('Content processing error:', error)
            // Return original content as fallback
            return content
        }
    }

    detectContentType(url) {
        const urlLower = url.toLowerCase()
        
        // Video formats
        if (urlLower.includes('.mp4')) return 'video/mp4'
        if (urlLower.includes('.webm')) return 'video/webm'
        if (urlLower.includes('.mov') || urlLower.includes('.quicktime')) return 'video/quicktime'
        if (urlLower.includes('.avi')) return 'video/avi'
        
        // Image formats
        if (urlLower.includes('.png')) return 'image/png'
        if (urlLower.includes('.jpg') || urlLower.includes('.jpeg')) return 'image/jpeg'
        if (urlLower.includes('.webp')) return 'image/webp'
        if (urlLower.includes('.gif')) return 'image/gif'
        if (urlLower.includes('.svg')) return 'image/svg+xml'
        
        // Fallback based on context
        if (urlLower.includes('video')) return 'video/mp4'
        return 'image/png'
    }

    detectContentTypeFromBase64(base64Data) {
        if (base64Data.startsWith('data:')) {
            const match = base64Data.match(/^data:([^;]+);base64,/)
            if (match) return match[1]
        }
        
        const header = base64Data.substring(0, 20)
        if (header.startsWith('/9j/')) return 'image/jpeg'
        if (header.startsWith('iVBOR')) return 'image/png'
        if (header.startsWith('UklGR')) return 'image/webp'
        if (header.startsWith('R0lGOD')) return 'image/gif'
        
        return 'image/jpeg'
    }

    async processImageResult(result, userId, responseFormat = 'url', usageLogId) {
        if (!result || !result.data) return result

        const processedData = await Promise.all(
            result.data.map(async (item, index) => {
                const itemUsageLogId = result.data.length > 1 ? `${usageLogId}-${index}` : usageLogId
                return await this.processContent(item, responseFormat, itemUsageLogId)
            })
        )

        return {
            ...result,
            data: processedData
        }
    }

    async processVideoResult(result, userId, responseFormat = 'url', usageLogId) {
        if (!result || !result.data) return result

        const processedData = await Promise.all(
            result.data.map(async (item, index) => {
                const itemUsageLogId = result.data.length > 1 ? `${usageLogId}-${index}` : usageLogId
                return await this.processContent(item, responseFormat, itemUsageLogId)
            })
        )

        return {
            ...result,
            data: processedData
        }
    }
}

export const storageService = new StorageService() 