const express = require('express')
const router = express.Router()
const { auth, isAdmin } = require('../../middleware/auth')
const {
  validateProviderCreation,
  validateProviderUpdate
} = require('../../middleware/validators')
const {
  createProvider,
  listProviders,
  getProvider,
  updateProvider,
  deleteProvider,
  updateProviderStatus
} = require('../controllers/providerController')

// All routes require authentication and admin privileges
router.use(auth)
router.use(isAdmin)

// Create a new provider
router.post('/', validateProviderCreation, createProvider)

// List all providers
router.get('/', listProviders)

// Get a specific provider
router.get('/:id', getProvider)

// Update a provider
router.put('/:id', validateProviderUpdate, updateProvider)

// Delete a provider
router.delete('/:id', deleteProvider)

// Update provider status
router.put('/:id/status', updateProviderStatus)

module.exports = router 