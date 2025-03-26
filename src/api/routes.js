const express = require('express')
const { auth } = require('../middleware/auth')
const imageRoutes = require('./routes/imageRoutes')
const userRoutes = require('./routes/userRoutes')
const apiKeyRoutes = require('./routes/apiKeyRoutes')
const providerRoutes = require('./routes/providerRoutes')

const router = express.Router()

// Public routes
router.use('/auth', userRoutes)

// Protected routes
router.use('/images', auth, imageRoutes)
router.use('/api-keys', auth, apiKeyRoutes)
router.use('/providers', auth, providerRoutes)

module.exports = router 