import express from 'express'
import { generateVideo } from '../services/videoService.js'
import { validateVideoParams } from '../services/validateVideoParams.js'
import { createGenerationHandler } from '../services/generationWrapper.js'
const router = express.Router()

const videoGenerationHandler = createGenerationHandler({ validateParams: validateVideoParams, generateFn: generateVideo })

// POST /v1/videos/generations
router.post('/generations', videoGenerationHandler)

export const videoRoutes = router 