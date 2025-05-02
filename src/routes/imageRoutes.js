import express from 'express'
import multer from 'multer'
import path from 'path'
import { generateImage } from '../services/imageService.js'
import { models } from '../shared/models/index.js'
import { validateParams } from '../services/validateParams.js'
import { preLogUsage, refundUsage, postLogUsage } from '../services/logUsage.js'
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
router.get('/models', (req, res) => {
    res.json(models)
})

// POST /v1/images/generations
router.post('/generations', async (req, res) => {
    await generateImageWrapper(req, res)
})

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
    async (req, res) => {
        await generateImageWrapper(req, res)
    }
)

async function generateImageWrapper(req, res) {
    try {
        const apiKey = res.locals.key
        const params = validateParams(req)
        try {
            const usageLogEntry = await preLogUsage(params, apiKey)

            let imageResult
            try {
                imageResult = await generateImage(params, apiKey.user.id)
            } catch (error) {
                const errorToLog = error?.errorResponse?.message || error?.message || 'unknown error'
                await refundUsage(apiKey, usageLogEntry, errorToLog)
                throw error
            }
            
            const postPriceInt = await postLogUsage(params, apiKey, usageLogEntry, imageResult)
            imageResult.cost = postPriceInt/10000
            res.json(imageResult)
        } catch (error) {
            // If the error is already in the correct format, forward it as-is
            if (error?.errorResponse) {
                return res.status(error.status || 500).json(error.errorResponse)
            }
        
            console.error('Image generation error:', error)
            // If it's a different type of error, wrap it in the standard format
            res.status(500).json({
                error: {
                    message: error.message || 'Failed to generate image',
                    type: 'internal_error'
                }
            })
        }
    } catch (error) {
        console.error('Image generation error:', error)
        return res.status(400).json({
            error: {
                message: error.message || 'Failed to generate image',
                type: 'invalid_request_error'
            }
        })
    }
}

export const imageRoutes = router 