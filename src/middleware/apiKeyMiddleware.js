import { prisma } from '../config/database.js'
import { validateTempToken } from '../shared/tempAuth.js'

export const validateApiKey = async (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(401).json({
            error: {
                message: 'Authorization header is required',
                type: 'unauthorized'
            }
        })
    }

    try {
        let key = null
        const apiKeyString = authHeader.substring(7) // Remove 'Bearer ' prefix

        if (apiKeyString.length === 64) {
            // API key validation
            key = await prisma.APIKey.findUnique({
                where: { key: apiKeyString },
                select: {
                    id: true,
                    isActive: true,
                    user: {
                        select: {
                            id: true,
                            credits: true
                        }
                    }
                }
            })
            key.apiKeyTempJwt = false
        } else if (apiKeyString.length === 192) {
            // JWT token validation
            const jwtResult = validateTempToken(apiKeyString)
            if (!jwtResult || !jwtResult.userId) {
                return res.status(401).json({
                    error: {
                        message: 'Invalid or expired JWT token',
                        type: 'unauthorized'
                    }
                })
            }

            const user = await prisma.user.findUnique({
                where: { id: jwtResult.userId },
                select: {
                    id: true,
                    credits: true
                }
            })
            if (!user) {
                return res.status(401).json({
                    error: {
                        message: 'User not found for this JWT token',
                        type: 'unauthorized'
                    }
                })
            }

            key = {
                id: null,
                apiKeyTempJwt: true,
                isActive: true,
                user: user
            }
        } else {
            return res.status(401).json({
                error: {
                    message: 'Invalid authorization token length: ' + apiKeyString.length,
                    type: 'unauthorized'
                }
            })
        }

        if (!key || !key.user || !key.user.id) {
            return res.status(401).json({
                error: {
                    message: 'Invalid authorization token',
                    type: 'unauthorized'
                }
            })
        }

        if (!key.isActive) {
            return res.status(401).json({
                error: {
                    message: 'API key is inactive',
                    type: 'unauthorized'
                }
            })
        }

        // Pass data through res.locals instead of req
        res.locals.key = key
        next()
    } catch (error) {
        console.error('Error validating API key:', error)
        return res.status(500).json({
            error: {
                message: 'Error validating API key',
                type: 'internal_error'
            }
        })
    }
}
