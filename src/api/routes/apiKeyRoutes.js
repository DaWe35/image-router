const express = require('express')
const { createApiKey, listApiKeys, deleteApiKey, updateApiKey } = require('../controllers/apiKeyController')
const { validateApiKeyCreation, validateApiKeyUpdate } = require('../middleware/validators')
const { auth } = require('../middleware/auth')

const router = express.Router()

// All routes require authentication
router.use(auth)

// Create new API key
router.post('/', validateApiKeyCreation, createApiKey)

// List API keys
router.get('/', listApiKeys)

// Update API key
router.put('/:id', validateApiKeyUpdate, updateApiKey)

// Delete API key
router.delete('/:id', deleteApiKey)

module.exports = router 