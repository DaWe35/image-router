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
        let user = null

        // Check if it's a Bearer token
        if (authHeader.startsWith('Bearer ')) {
            const apiKey = authHeader.substring(7) // Remove 'Bearer ' prefix
            key = await prisma.aPIKey.findUnique({
                where: { key: apiKey },
                include: { user: true }
            })
            if (key) {
                user = key.user
            }
        }

        // If Bearer token failed, try JWT validation
        if (!key) {
            const jwtResult = validateTempToken(authHeader)
            if (jwtResult?.userId) {
                user = await prisma.user.findUnique({
                    where: { id: jwtResult.userId }
                })
                if (user) {
                    key = {
                        id: 'temp',
                        isActive: true,
                        user: user
                    }
                }
            }
        }

        if (!key || !user) {
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

        // Get the model price
        const model = req.body.model
        const modelConfig = imageModels[model]
        if (!modelConfig) {
            return res.status(404).json({
                error: {
                    message: "'model' is not available",
                    type: "invalid_request_error"
                }
            })
        }

        const usdPrice = modelConfig.price
        const dbPrice = convertPriceToDbFormat(usdPrice)
        
        if (user.credits < dbPrice) {
            return res.status(403).json({
                error: {
                    message: 'Insufficient credits',
                    type: 'forbidden'
                }
            })
        }

        // Pass data through res.locals instead of req
        res.locals.apiKey = key
        res.locals.user = user
        res.locals.modelPrice = dbPrice
        res.locals.model = model
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
    const startTime = Date.now()
    const { apiKey, user, modelPrice, model } = res.locals

    try {
        // Use a transaction to ensure both operations succeed or fail together
        const usageEntry = await prisma.$transaction(async (tx) => {
            // Deduct credits
            await tx.user.update({
                where: { id: user.id },
                data: { credits: { decrement: modelPrice } }
            })

            // Create API usage entry
            return await tx.aPIUsage.create({
                data: {
                    apiKeyId: apiKey.id,
                    model: model || 'unknown',
                    provider: imageModels[model]?.providers[0] || 'unknown',
                    prompt: req.body.prompt || '',
                    cost: modelPrice,
                    speedMs: 0,
                    imageSize: req.body.size || 1024,
                    status: 'processing'
                }
            })
        })

        // Store the original send function
        const originalSend = res.send

        // Override the send function to update the usage entry
        res.send = async function (data) {
            const endTime = Date.now()
            const speedMs = endTime - startTime

            try {
                // Update the API usage entry with final details
                await prisma.aPIUsage.update({
                    where: { id: usageEntry.id },
                    data: {
                        speedMs,
                        status: res.statusCode === 200 ? 'success' : 'error',
                        error: res.statusCode !== 200 ? data?.error?.message : null
                    }
                })

                // If the request failed, refund the credits
                if (res.statusCode !== 200) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { credits: { increment: modelPrice } }
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