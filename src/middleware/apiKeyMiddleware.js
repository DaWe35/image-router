import { prisma } from '../config/database.js'
import { validateTempToken } from '../shared/tempAuth.js'

export const validateApiKey = async (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: {
                message: 'Authorization header must be provided as Bearer token',
                type: 'unauthorized'
            }
        })
    }

    try {
        let key = null
        const apiKeyString = authHeader.slice(7).trim() // Remove 'Bearer ' prefix and trim whitespace

        if (apiKeyString.length === 64) { // API key validation
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
            if (!key) {
                return res.status(401).json({
                    error: { message: 'Invalid API key', type: 'unauthorized' }
                })
            }
            key.apiKeyTempJwt = false
        } else if (apiKeyString.length >= 100) { // JWT token validation
            const jwtResult = validateTempToken(apiKeyString)
            if (!jwtResult) {
                return res.status(401).json({
                    error: { message: 'Invalid or expired JWT token', type: 'unauthorized' }
                })
            }

            if (jwtResult.userId && jwtResult.userId !== 'anon_user') { // Users
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
            } else { // Guests
                // Create guest user if not exists
                const guestUser = await prisma.user.upsert({
                    where: { id: 'anon_user' },
                    update: {},
                    create: { id: 'anon_user', credits: 0 }
                })
                key = {
                    id: null,
                    apiKeyTempJwt: true,
                    isActive: true,
                    user: guestUser
                }
            }

            if (key.user.credits <= 0) {
                // Strict IP check for free and guest users
                const proxyCount = Number(process.env.PROXY_COUNT || 0)
                const clientIp = proxyCount > 0 ? req.headers['cf-connecting-ip'] : req.ip
                if (clientIp !== jwtResult.jwtGeneratedWithIp) {
                    return res.status(403).json({
                        error: { message: 'Guest token IP mismatch: ' + clientIp + ' !== ' + jwtResult.jwtGeneratedWithIp, type: 'unauthorized' }
                    })
                }
            }
        } else {
            return res.status(401).json({
                error: {
                    message: `Invalid authorization token length: ${apiKeyString.length}`,
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
