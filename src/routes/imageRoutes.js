import express from 'express'
import multer from 'multer'
import path from 'path'
import { generateImage } from '../services/imageService.js'
import { imageModels } from '../shared/imageModels/index.js'
import { validateImageParams } from '../services/validateImageParams.js'
import { createGenerationHandler } from '../services/generationWrapper.js'
const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/tmp')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 25 * 1024 * 1024 // 25MB max file size
    }
})

// Error handler for multer errors
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: {
                message: `File upload error: ${err.message}`,
                type: 'invalid_request_error'
            }
        })
    }
    next(err)
}

// GET /v1/images/models
// Deprecated; I left it here for compatibility
router.get('/models', (req, res) => {
    res.json(imageModels)
})

// POST /v1/images/generations
const imageGenerationHandler = createGenerationHandler({ validateParams: validateImageParams, generateFn: generateImage })

router.post('/generations', imageGenerationHandler)

// POST /v1/images/edits
router.post('/edits', 
    upload.fields([
        { name: 'image', maxCount: 16 },
        { name: 'image[]', maxCount: 16 },
        { name: 'mask', maxCount: 1 },
        { name: 'mask[]', maxCount: 1 }
    ]), 
    handleMulterError,
    (req, res, next) => {
        if (req.files['image[]'] && !req.files.image) {
            req.files.image = req.files['image[]']
            delete req.files['image[]']
        }
        if (req.files['mask[]'] && !req.files.mask) {
            req.files.mask = req.files['mask[]']
            delete req.files['mask[]']
        }
        next()
    },
    imageGenerationHandler
)

export const imageRoutes = router