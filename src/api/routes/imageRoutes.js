const express = require('express')
const router = express.Router()
const { auth } = require('../../middleware/auth')
const { validateImageRequest } = require('../../middleware/validators')
const {
  generateImage,
  getImageStatus,
  listImages
} = require('../controllers/imageController')

// All routes require authentication
router.use(auth)

// Generate image
router.post('/generations', validateImageRequest, generateImage)

// Get image status
router.get('/generations/:id', getImageStatus)

// List images
router.get('/generations', listImages)

module.exports = router 