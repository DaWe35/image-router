import express from 'express'
import { generateImage } from '../services/imageService.js'
import { imageModels } from '../shared/common.js'
import { validateParams } from '../services/validateParams.js'
import { preLogUsage, refundUsage, postLogUsage } from '../services/logUsage.js'
import { calculateDynamicPrice } from '../shared/priceCalculator.js'
const router = express.Router()

// GET /v1/images/models
router.get('/models', (req, res) => {
    res.json(imageModels)
})

// POST /v1/images/generations
router.post('/generations', async (req, res) => {
    const error = validateParams(req.body)
    if (error) {
        return res.status(400).json({
            error: {
                message: error,
                type: 'invalid_request_error'
            }
        })
    } else {
        try {
            const usageLogEntry = await preLogUsage(req, res)

            let imageResult
            try {
                imageResult = await generateImage(req.body, res.locals.key.user.id)
            } catch (error) {
                const errorToLog = error?.errorResponse.message || error.message || 'unknown error'
                await refundUsage(req, res, usageLogEntry, errorToLog)
                throw error
            }
            
            const actualPrice = calculateDynamicPrice(req.body.model, imageResult)
            const postLogSuccess = await postLogUsage(req, res, usageLogEntry, actualPrice, imageResult.responseTime)
            if (postLogSuccess !== true) {
                console.error('Error in postLogUsage for image generation:', JSON.stringify(req.body))
                throw new Error('Failed to postlog usage')
            }

            imageResult.cost = actualPrice
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
    }
})

export const imageRoutes = router 