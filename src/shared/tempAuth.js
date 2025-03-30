import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const DATABASE_URL = process.env.DATABASE_URL

if (DATABASE_URL && !JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
}

const TOKEN_EXPIRY = '1m' // Token expires in 5 minutes

// Use this function to generate a temporary token on the frontend
/* export const generateTempToken = (userId) => {
    return jwt.sign(
        { userId },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
    )
} */

export const validateTempToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        return decoded
    } catch (error) {
        return null
    }
} 