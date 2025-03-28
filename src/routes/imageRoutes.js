import express from 'express'
import { generateImage } from '../services/imageService.js'
import { imageModels } from '../shared/common.js'

const router = express.Router()

// POST /v1/images/generations
router.post('/generations', async (req, res) => {
    try {
        const { prompt, model } = req.body

        if (!prompt) {
            return res.status(400).json({
                error: {
                    message: 'Prompt is required',
                    type: 'invalid_request_error'
                }
            })
        }
        
        if (!model) {
            return res.status(400).json({
                error: {
                    message: 'Model is required',
                    type: 'invalid_request_error'
                }
            })
        }

        // Validate model parameter
        if (!imageModels[model].providers[0]) {
            return res.status(400).json({
                error: {
                    message: 'Invalid model parameter',
                    type: 'invalid_request_error'
                }
            })
        }

        const result = await generateImage(req.body)
        res.json(result)

    } catch (error) {

        console.error('Image generation error:', error)

        // If the error is already in the correct format, forward it as-is
        if (error?.errorResponse) {
            return res.status(error.status || 500).json(error.errorResponse)
        }
        
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