import express from 'express'
import { generateImage } from '../services/imageService.js'

const router = express.Router()

// POST /v1/images/generations
router.post('/generations', async (req, res) => {
  try {
    const { prompt, n = 1, size = '1024x1024', model = 'dall-e-3' } = req.body

    if (!prompt) {
      return res.status(400).json({
        error: {
          message: 'Prompt is required',
          type: 'invalid_request_error'
        }
      })
    }

    // Validate size parameter
    const validSizes = ['128x128', '256x256', '512x512', '1024x1024']
    if (!validSizes.includes(size)) {
      return res.status(400).json({
        error: {
          message: 'Invalid size parameter',
          type: 'invalid_request_error'
        }
      })
    }

    // Validate model parameter
    const validModels = ['dall-e-2', 'dall-e-3', 'stabilityai/sdxl-turbo']
    if (!validModels.includes(model)) {
      return res.status(400).json({
        error: {
          message: 'Invalid model parameter',
          type: 'invalid_request_error'
        }
      })
    }

    const result = await generateImage({
      prompt,
      n: parseInt(n),
      size,
      model
    })

    res.json(result)
  } catch (error) {
    console.error('Image generation error:', error)
    
    // If the error is already in the correct format, forward it as-is
    if (error) {
      return res.status(error.status || 500).json(error)
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