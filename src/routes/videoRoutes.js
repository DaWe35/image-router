import express from 'express'
import { generateVideo } from '../services/videoService.js'
import { videoModels } from '../shared/videoModels/index.js'
import { validateVideoParams } from '../services/validateVideoParams.js'
import { preLogUsage, refundUsage, postLogUsage } from '../services/logUsage.js'
const router = express.Router()

// Simple in-memory store for pending DeepInfra requests
// In production, you might want to use Redis or a database
const pendingRequests = new Map()

// GET /v1/videos/models
router.get('/models', (req, res) => {
    res.json(videoModels)
})

// POST /v1/videos/generations
router.post('/generations', async (req, res) => {
    await generateVideoWrapper(req, res)
})

// POST /webhook/deepinfra/video - webhook endpoint for DeepInfra callbacks
router.post('/webhook/deepinfra/video/:requestId', (req, res) => {
    try {
        const requestId = req.params.requestId
        // req.body is already parsed by the webhook-specific middleware in index.js
        const webhookData = req.body
        
        console.log(`Received DeepInfra webhook for request ${requestId}:`, webhookData)
        
        // Find the pending request
        const pendingRequest = pendingRequests.get(requestId)
        if (!pendingRequest) {
            console.log(`No pending request found for ID: ${requestId}`)
            return res.status(404).json({ error: 'Request not found' })
        }
        
        // Resolve the promise with the webhook data
        pendingRequest.resolve(webhookData)
        
        // Clean up
        pendingRequests.delete(requestId)
        
        // Respond to DeepInfra
        res.status(200).json({ success: true })
        
    } catch (error) {
        console.error('Webhook processing error:', error)
        res.status(500).json({ error: 'Webhook processing failed' })
    }
})

// Function to create a pending request and return a promise
export function createPendingRequest(requestId) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            pendingRequests.delete(requestId)
            reject(new Error('Webhook timeout after 30 minutes'))
        }, 30 * 60 * 1000) // 30 minutes timeout
        
        pendingRequests.set(requestId, { 
            resolve: (data) => {
                clearTimeout(timeout)
                resolve(data)
            },
            reject: (error) => {
                clearTimeout(timeout)
                reject(error)
            }
        })
    })
}

async function generateVideoWrapper(req, res) {
    try {
        const apiKey = res.locals.key
        const params = validateVideoParams(req)
        try {
            const usageLogEntry = await preLogUsage(params, apiKey, req)

            let videoResult
            try {
                let fetchParams = structuredClone(params) // prevent side effects
                videoResult = await generateVideo(fetchParams, apiKey.user.id, res)
            } catch (error) {
                const errorToLog = error?.errorResponse?.message || error?.message || 'unknown error'
                await refundUsage(apiKey, usageLogEntry, errorToLog)
                throw error
            }
            
            const postPriceInt = await postLogUsage(params, apiKey, usageLogEntry, videoResult)
            videoResult.cost = postPriceInt/10000

            res.write(JSON.stringify(videoResult))
            res.end()
        } catch (error) {
            // If the error is already in the correct format, forward it as-is
            if (error?.errorResponse) {
                res.write(JSON.stringify(error.errorResponse))
                res.status(error.status || 500).end()
                return
            }
        
            console.error('Video generation error:', error)
            const errorResponse = {
                error: {
                    message: error.message || 'Failed to generate video',
                    type: 'internal_error'
                }
            }
            res.write(JSON.stringify(errorResponse))
            res.status(500).end()
        }
    } catch (error) {
        console.error('Video generation error:', error)
        res.status(400)
        res.write(JSON.stringify({
            error: {
                message: error.message || 'Failed to generate video',
                type: 'invalid_request_error'
            }
        }))
        res.end()
    }
}

export const videoRoutes = router 