import express from 'express'
import { generateVideo } from '../services/videoService.js'
import { videoModels } from '../shared/videoModels/index.js'
import { validateVideoParams } from '../services/validateVideoParams.js'
import { preLogUsage, refundUsage, postLogUsage } from '../services/logUsage.js'
const router = express.Router()

// POST /v1/videos/generations
router.post('/generations', async (req, res) => {
    await generateVideoWrapper(req, res)
})

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