import express from 'express'
import { upload, handleMulterError, normalizeUploadFilesFactory, cleanupUploadedFiles } from '../middleware/uploadMiddleware.js'
import { generateImage } from '../services/imageService.js'
import { imageModels } from '../shared/imageModels/index.js'
import { validateImageParams } from '../services/validateImageParams.js'
import { createGenerationHandler } from '../services/generationWrapper.js'
const router = express.Router()

// GET /v1/images/models
// Deprecated; I left it here for compatibility
router.get('/models', (req, res) => {
    res.json(imageModels)
})

// POST /v1/images/generations
const imageGenerationHandler = createGenerationHandler({ validateParams: validateImageParams, generateFn: generateImage })

// Define upload handler and normalized middleware specific for image routes
const uploadFields = upload.fields([
    { name: 'image', maxCount: 16 },
    { name: 'image[]', maxCount: 16 },
    { name: 'mask', maxCount: 1 },
    { name: 'mask[]', maxCount: 1 }
])

const normalizeUploadFiles = normalizeUploadFilesFactory(['image', 'mask'])

// POST /v1/images/generations (can optionally include image / mask uploads)
router.post('/generations',
    uploadFields,
    handleMulterError,
    normalizeUploadFiles,
    cleanupUploadedFiles,
    imageGenerationHandler
)

// POST /v1/images/edits (same behaviour as /generations, kept for backwards compatibility)
router.post('/edits',
    uploadFields,
    handleMulterError,
    normalizeUploadFiles,
    cleanupUploadedFiles,
    imageGenerationHandler
)

export const imageRoutes = router