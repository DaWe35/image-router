import { preLogUsage, refundUsage, postLogUsage } from './logUsage.js'
import { freeTierLimiter } from '../middleware/freeTierLimiter.js'
import { imageModels } from '../shared/imageModels/index.js'
import { videoModels } from '../shared/videoModels/index.js'
import { selectProvider } from '../utils/providerSelector.js'

function cleanupInternalFields(result) {
  if (result && result.data && Array.isArray(result.data)) {
    result.data.forEach(item => {
      delete item._uploadedUrl
    })
  }
}

export function createGenerationHandler({ validateParams, generateFn }) {
  return async function generationHandler(req, res) {
    try {
      const apiKey = res.locals.key
      const params = validateParams(req)

      try {
        // Run daily free-tier check
        await freeTierLimiter(req, res, () => {})
        if (res.headersSent) {
          // freeTierLimiter already responded (limit exceeded or error)
          return
        }

        // Select provider once per request to keep consistency across logging and generation
        const models = { ...imageModels, ...videoModels }
        const modelConfig = models[params.model]
        const providerIndex = selectProvider(modelConfig?.providers, params)

        const usageLogEntry = await preLogUsage(params, apiKey, req, providerIndex)

        let generationResult
        try {
          const fetchParams = structuredClone(params) // prevent side effects
          generationResult = await generateFn(fetchParams, apiKey.user.id, res, usageLogEntry.id, providerIndex)
        } catch (error) {
          const errorToLog = error?.errorResponse?.error?.message || error?.message || 'unknown error'
          await refundUsage(apiKey, usageLogEntry, errorToLog)
          throw error
        }

        const postPriceInt = await postLogUsage(params, apiKey, usageLogEntry, generationResult, providerIndex)
        generationResult.cost = postPriceInt / 10000

        cleanupInternalFields(generationResult)

        res.write(JSON.stringify(generationResult))
        res.end()
      } catch (error) {
        // If the error is already in the correct format, forward it as-is
        if (error?.errorResponse) {
          res.write(JSON.stringify(error.errorResponse))
          res.status(error.status || 500).end()
          return
        }

        const errorResponse = {
          error: {
            message: error.message || 'Failed to generate',
            type: 'internal_error'
          }
        }
        res.write(JSON.stringify(errorResponse))
        res.status(500).end()
      }
    } catch (error) {
      console.error('Generation error:', error)
      res.status(400)
      res.write(JSON.stringify({
        error: {
          message: error.message || 'Failed to generate',
          type: 'invalid_request_error'
        }
      }))
      res.end()
    }
  }
} 