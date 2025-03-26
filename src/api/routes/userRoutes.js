const express = require('express')
const { register, login, getProfile, updateProfile, changePassword } = require('../controllers/userController')
const { validateRegistration, validateLogin, validateProfileUpdate } = require('../middleware/validators')
const { auth } = require('../middleware/auth')

const router = express.Router()

// Public routes
router.post('/register', validateRegistration, register)
router.post('/login', validateLogin, login)

// Protected routes
router.get('/profile', auth, getProfile)
router.put('/profile', auth, validateProfileUpdate, updateProfile)
router.put('/password', auth, changePassword)

module.exports = router 