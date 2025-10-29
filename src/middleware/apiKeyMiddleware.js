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
        } else if (apiKeyString.length >= 100) { // JWT token validation, could be temp-login or anon
            const jwtResult = validateTempToken(apiKeyString)
            if (!jwtResult) {
                return res.status(401).json({
                    error: { message: 'Invalid or expired JWT token', type: 'unauthorized' }
                })
            }

            // Anonymous token path
            if (jwtResult.anonIp) {
                const proxyCount = Number(process.env.PROXY_COUNT || 0)
                const clientIp = proxyCount > 0 ? req.headers['cf-connecting-ip'] : req.ip
                if (clientIp !== jwtResult.anonIp) {
                    return res.status(403).json({
                        error: { message: 'Anon token IP mismatch: ' + clientIp + ' !== ' + jwtResult.anonIp, type: 'unauthorized' }
                    })
                }

                // Check if token already used
                const today = new Date()
                today.setHours(0,0,0,0)
                const tokenCount = await prisma.APIUsage.count({
                    where: {
                        apiKeyTempJwt: true,
                        ip: clientIp,
                        createdAt: { gte: today }
                    }
                })
                if (tokenCount >= 10) {
                    return res.status(429).json({
                        error: { message: 'Daily free limit reached. Deposit any amount to unlock 50 free images/day: https://imagerouter.io/pricing', type: 'rate_limit_error' }
                    })
                }

                // Ensure we have a shared anon user row
                const anonUser = await prisma.user.upsert({
                    where: { id: 'anon_user' },
                    update: {},
                    create: { id: 'anon_user', credits: 0 }
                })

                key = {
                    id: null,
                    apiKeyTempJwt: true,
                    isActive: true,
                    isAnon: true,
                    user: anonUser
                }
            } else if (jwtResult.userId) {
                // existing temp-login path
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
                        message: `Invalid JWT token format`,
                        type: 'unauthorized'
                    }
                })
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
