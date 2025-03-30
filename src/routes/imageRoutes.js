import express from 'express'
import { generateImage } from '../services/imageService.js'
import { imageModels } from '../shared/common.js'

const router = express.Router()

// GET /v1/images/models
router.get('/models', (req, res) => {
    res.json(imageModels)
})

// POST /v1/images/generations
router.post('/generations', async (req, res) => {
    try {
        const { prompt, model, response_format } = req.body

        if (!prompt) {
            return res.status(400).json({
                error: {
                    code: null,
                    message: "'prompt' is a required property",
                    param: null,
                    type: "invalid_request_error"
                }
            })
        }
        
        if (!model) {
            return res.status(400).json({
                error: {
                    code: null,
                    message: "'model' is a required property",
                    param: null,
                    type: "invalid_request_error"
                }
            })
        }

        // Validate model parameter
        if (!imageModels[model]?.providers[0]) {
            return res.status(404).json({
                error: {
                    code: null,
                    message: "'model' is not available",
                    param: null,
                    type: "invalid_request_error"
                }
            })
        }

        if (response_format && response_format !== 'b64_json') {
            return res.status(400).json({
                error: {
                    code: null,
                    message: "'response_format' must be 'b64_json'",
                    param: null,
                    type: "invalid_request_error"
                }
            })
        }

        const result = await generateImage(req.body)
        res.json(result)

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
})

export const imageRoutes = router 