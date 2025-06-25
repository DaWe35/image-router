import express from 'express'
import { generateVideo } from '../services/videoService.js'
import { validateVideoParams } from '../services/validateVideoParams.js'
import { createGenerationHandler } from '../services/generationWrapper.js'
import { upload, handleMulterError, normalizeUploadFilesFactory } from '../middleware/uploadMiddleware.js'

const router = express.Router()

const videoGenerationHandler = createGenerationHandler({ validateParams: validateVideoParams, generateFn: generateVideo })

const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'image[]', maxCount: 1 }
])

const normalizeUploadFiles = normalizeUploadFilesFactory(['image'])

// POST /v1/videos/generations (can optionally include an image)
router.post('/generations',
    uploadFields,
    handleMulterError,
    normalizeUploadFiles,
    videoGenerationHandler
)

export const videoRoutes = router 