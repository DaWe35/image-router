import { prisma } from '../config/database.js'
import { imageModels } from '../shared/common.js'
import { validateTempToken } from '../shared/tempAuth.js'

// Convert USD price to database format (multiply by 10000 to get 4 decimal places)
const convertPriceToDbFormat = (usdPrice) => Math.round(usdPrice * 10000)

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

        // Get the model config
        const modelName = req.body.model
        const modelConfig = imageModels[modelName]
        if (!modelConfig) {
            return res.status(404).json({
                error: {
                    message: "model '" + modelName + "' is not available",
                    type: "invalid_request_error"
                }
            })
        }

        // Get the model price
        const usdPrice = modelConfig.price
        if (typeof usdPrice !== 'number') {
            return res.status(404).json({
                error: {
                    message: 'Model price is not configured properly.',
                    type: 'invalid_request_error'
                }
            })
        }
        const dbPrice = convertPriceToDbFormat(usdPrice)
        
        // Check if the user has enough credits
        if (key.user.credits < dbPrice) {
            return res.status(403).json({
                error: {
                    message: 'Insufficient credits',
                    type: 'forbidden'
                }
            })
        }

        // Pass data through res.locals instead of req
        res.locals.key = key
        res.locals.dbPrice = dbPrice
        res.locals.modelName = modelName
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

export const logApiUsage = async (req, res, next) => {
    const { key, dbPrice, modelName } = res.locals

    try {
        // Use a transaction to ensure both operations succeed or fail together
        const usageEntry = await prisma.$transaction(async (tx) => {
            // Deduct credits
            await tx.user.update({
                where: { id: key.user.id },
                data: { credits: { decrement: dbPrice } }
            })

            // Create API usage entry
            return await tx.APIUsage.create({
                data: {
                    apiKeyId: key.id || undefined,
                    apiKeyTempJwt: key.apiKeyTempJwt,
                    userId: key.user.id,
                    model: modelName || 'unknown',
                    provider: imageModels[modelName]?.providers[0] || 'unknown',
                    prompt: req.body.prompt || '',
                    cost: dbPrice,
                    speedMs: 0,
                    imageSize: req.body.size || 'unknown',
                    status: 'processing'
                }
            })
        })

        const startTime = Date.now()
        // Store the original send function
        const originalSend = res.send

        // Override the send function to update the usage entry
        res.send = async function (data) {
            const endTime = Date.now()
            const speedMs = endTime - startTime

            try {
                // Update the API usage entry with final details
                await prisma.APIUsage.update({
                    where: { id: usageEntry.id },
                    data: {
                        speedMs,
                        status: res.statusCode === 200 ? 'success' : 'error',
                        error: res.statusCode !== 200 ? JSON.stringify(data?.errorResponse) : null
                    }
                })
                console.log(data)
                console.log(data?.error)
                console.log(data?.error?.message)

                // If the request failed, refund the credits
                if (res.statusCode !== 200) {
                    await prisma.user.update({
                        where: { id: key.user.id },
                        data: { credits: { increment: dbPrice } }
                    })
                }
            } catch (error) {
                console.error('Error updating API usage:', error)
                // Log the error but don't fail the response
            }

            // Call the original send function
            return originalSend.apply(res, arguments)
        }

        next()
    } catch (error) {
        console.error('Error in logApiUsage:', error)
        // If the transaction fails, we should not proceed with the request
        return res.status(500).json({
            error: {
                message: 'Failed to process request. Please try again.',
                type: 'transaction_error'
            }
        })
    }
} 