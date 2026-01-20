import express from 'express'
import { upload, handleMulterError, normalizeUploadFilesFactory, cleanupUploadedFiles } from '../middleware/uploadMiddleware.js'
import { generateUnified, convertInternalToOpenResponses } from '../services/unifiedService.js'
import { validateUnifiedParams } from '../services/validateUnifiedParams.js'
import { createGenerationHandler } from '../services/generationWrapper.js'

const router = express.Router()

/**
 * Custom wrapper for unified API that converts response to Open Responses format
 */
function createUnifiedGenerationHandler({ validateParams, generateFn }) {
  const baseHandler = createGenerationHandler({ validateParams, generateFn })
  
  return async function unifiedGenerationHandler(req, res) {
    // Store original write function
    const originalWrite = res.write.bind(res)
    const originalEnd = res.end.bind(res)
    
    let responseData = ''
    
    // Intercept write to capture the internal format response
    res.write = function(chunk) {
      if (chunk) {
        responseData += chunk.toString()
      }
      return true // Don't actually write yet
    }
    
    // Intercept end to convert and send the final response
    res.end = function(chunk) {
      if (chunk) {
        responseData += chunk.toString()
      }
      
      try {
        // Parse internal format
        const internalResult = JSON.parse(responseData)
        
        // Check if it's an error response
        if (internalResult.error) {
          // Pass through errors as-is
          originalWrite(responseData)
          originalEnd()
          return
        }
        
        // Convert to Open Responses format
        const openResponsesResult = convertInternalToOpenResponses(internalResult, req.body.model)
        
        // Write the converted response
        originalWrite(JSON.stringify(openResponsesResult))
        originalEnd()
      } catch (error) {
        console.error('Error converting to Open Responses format:', error)
        // Fallback to original response
        originalWrite(responseData)
        originalEnd()
      }
    }
    
    // Call the base handler
    await baseHandler(req, res)
  }
}

// Define upload handler for unified routes (supports image, video, audio, mask)
const uploadFields = upload.fields([
    { name: 'image', maxCount: 16 },
    { name: 'image[]', maxCount: 16 },
    { name: 'video', maxCount: 16 },
    { name: 'video[]', maxCount: 16 },
    { name: 'audio', maxCount: 16 },
    { name: 'audio[]', maxCount: 16 },
    { name: 'mask', maxCount: 1 },
    { name: 'mask[]', maxCount: 1 }
])

const normalizeUploadFiles = normalizeUploadFilesFactory(['image', 'video', 'audio', 'mask'])

const unifiedHandler = createUnifiedGenerationHandler({ 
    validateParams: validateUnifiedParams, 
    generateFn: generateUnified 
})

// POST /v1/responses - Unified endpoint following Open Responses spec
router.post('/responses',
    uploadFields,
    handleMulterError,
    normalizeUploadFiles,
    cleanupUploadedFiles,
    unifiedHandler
)

export const unifiedRoutes = router
