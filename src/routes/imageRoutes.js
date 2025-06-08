import express from 'express'
import multer from 'multer'
import path from 'path'
import { generateImage } from '../services/imageService.js'
import { imageModels } from '../shared/imageModels/index.js'
import { validateImageParams } from '../services/validateImageParams.js'
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
// Deprecated; I left it here for compatibility
router.get('/models', (req, res) => {
    res.json(imageModels)
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
        const params = validateImageParams(req)
        try {
            const usageLogEntry = await preLogUsage(params, apiKey, req)

            let imageResult
            try {
                let fetchParams = structuredClone(params) // prevent side effects
                imageResult = await generateImage(fetchParams, apiKey.user.id, res, usageLogEntry.id)
            } catch (error) {
                const errorToLog = error?.errorResponse?.message || error?.message || 'unknown error'
                await refundUsage(apiKey, usageLogEntry, errorToLog)
                throw error
            }
            
            const postPriceInt = await postLogUsage(params, apiKey, usageLogEntry, imageResult)
            imageResult.cost = postPriceInt/10000

            res.write(JSON.stringify(imageResult))
            res.end()
        } catch (error) {
            // If the error is already in the correct format, forward it as-is
            if (error?.errorResponse) {
                res.write(JSON.stringify(error.errorResponse))
                res.status(error.status || 500).end()
                return
            }
        
            console.error('Image generation error:', error)
            const errorResponse = {
                error: {
                    message: error.message || 'Failed to generate image',
                    type: 'internal_error'
                }
            }
            res.write(JSON.stringify(errorResponse))
            res.status(500).end()
        }
    } catch (error) {
        console.error('Image generation error:', error)
        res.status(400)
        res.write(JSON.stringify({
            error: {
                message: error.message || 'Failed to generate image',
                type: 'invalid_request_error'
            }
        }))
        res.end()
    }
}

export const imageRoutes = router