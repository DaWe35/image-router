import express from 'express'
import { validateApiKey } from '../middleware/apiKeyMiddleware.js'

export const authRoutes = express.Router()

// Endpoint: GET /v1/auth/test
// Purpose: Allows external integrations (e.g. Zapier, n8n) to verify that an API key is valid.
// Returns basic account data when the supplied key is active and valid.
authRoutes.post('/test', validateApiKey, (req, res) => {
  const { id, credits } = res.locals.key.user
  return res.json({
    success: true,
    userId: id,
    credits
  })
})
