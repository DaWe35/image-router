const jwt = require('jsonwebtoken')
const { User } = require('../../models')
const { ApiError } = require('../../utils/errors')

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )
}

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      throw new ApiError({
        statusCode: 400,
        type: 'validation_error',
        message: 'Email already registered'
      })
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name
    })

    // Generate token
    const token = generateToken(user)

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ where: { email } })
    if (!user) {
      throw new ApiError({
        statusCode: 401,
        type: 'authentication_error',
        message: 'Invalid credentials'
      })
    }

    // Validate password
    const isValid = await user.validatePassword(password)
    if (!isValid) {
      throw new ApiError({
        statusCode: 401,
        type: 'authentication_error',
        message: 'Invalid credentials'
      })
    }

    // Update last login
    await user.update({ lastLoginAt: new Date() })

    // Generate token
    const token = generateToken(user)

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    next(error)
  }
}

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    })

    res.json(user)
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body
    const user = await User.findByPk(req.user.id)

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        throw new ApiError({
          statusCode: 400,
          type: 'validation_error',
          message: 'Email already taken'
        })
      }
    }

    // Update user
    await user.update({ name, email })

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    })
  } catch (error) {
    next(error)
  }
}

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findByPk(req.user.id)

    // Validate current password
    const isValid = await user.validatePassword(currentPassword)
    if (!isValid) {
      throw new ApiError({
        statusCode: 401,
        type: 'authentication_error',
        message: 'Current password is incorrect'
      })
    }

    // Update password
    await user.update({ password: newPassword })

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} 