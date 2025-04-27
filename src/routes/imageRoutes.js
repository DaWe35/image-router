import express from 'express'
import { generateImage } from '../services/imageService.js'
import { models } from '../shared/models/index.js'
import { validateParams } from '../services/validateParams.js'
import { preLogUsage, refundUsage, postLogUsage } from '../services/logUsage.js'
const router = express.Router()

// GET /v1/images/models
router.get('/models', (req, res) => {
    res.json(models)
})

// POST /v1/images/generations
router.post('/generations', async (req, res) => {
    try{
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
        return res.status(400).json({
            error: {
                message: error,
                type: 'invalid_request_error'
            }
        })
    }
})

export const imageRoutes = router 