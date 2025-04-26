import { imageModels } from '../shared/common.js'
import { prisma } from '../config/database.js'
import { estimateMaxPrice, convertPriceToDbFormat } from '../shared/priceCalculator.js'

export async function preLogUsage(req, res) {
    const { key } = res.locals
    const modelName = req.body.model
    const modelConfig = imageModels[modelName]

    const maxPriceUsd = estimateMaxPrice(modelConfig)
    const maxPriceInt = convertPriceToDbFormat(maxPriceUsd)
    
    // Check if the user has enough credits
    if (key.user.credits < maxPriceInt) {
        throw new Error('Insufficient credits, please topup your ImageRouter account')
    }

    if (key.user.isActive === false) {
        throw new Error('Your account is inactive, please contact support')
    }

    if (key.user.id === null) {
        throw new Error('Your account is not registered, please contact support')
    }

    if (key.id === null) {
        throw new Error('Your API key is not registered, please contact support')
    }

    // Use a transaction to ensure both operations succeed or fail together
    const usageLogEntry = await prisma.$transaction(async (tx) => {
        // Deduct maximum estimated credits initially
        await tx.user.update({
            where: { id: key.user.id },
            data: { credits: { decrement: maxPriceInt } }
        })

        // Create API usage entry
        return await tx.APIUsage.create({
            data: {
                apiKeyId: key.id || undefined,
                apiKeyTempJwt: key.apiKeyTempJwt,
                userId: key.user.id,
                model: modelName,
                provider: modelConfig?.providers[0],
                prompt: req.body.prompt || '',
                cost: maxPriceInt, // Initial cost is max price
                speedMs: 0,
                imageSize: req.body.size || 'unknown',
                status: 'processing'
            }
        })
    })
    console.log('Pre-log usage, charged', maxPriceInt)
    return usageLogEntry
}

export async function refundUsage(req, res, usageLogEntry, errorToLog) {
    const { key } = res.locals
    try {            
        // Use a transaction to update both user balance and API usage together
        await prisma.$transaction(async (tx) => {
            // Refund the full amount if request failed
            await tx.user.update({
                where: { id: key.user.id },
                data: { credits: { increment: usageLogEntry.cost } }
            })
            
            // Update API usage entry with error status
            await tx.APIUsage.update({
                where: { id: usageLogEntry.id },
                data: {
                    status: 'error',
                    error: errorToLog,
                    cost: 0 // Request failed, no cost
                }
            })
        })
        console.log('Failed image, refunded all', usageLogEntry.cost)
        return true
    } catch (error) {
        console.error('Failed to refund usage:', error)
        throw new Error('Failed to refund usage')
    }
}


export async function postLogUsage(req, res, usageLogEntry, actualPrice, responseTime) {
    const { key } = res.locals
    const modelName = req.body.model
    const modelConfig = imageModels[modelName]
    const maxPriceUsd = estimateMaxPrice(modelConfig)
    const maxPriceInt = convertPriceToDbFormat(maxPriceUsd)

    try {
        // Use a transaction to update both user balance and API usage together
        await prisma.$transaction(async (tx) => {
            // Calculate actual price for successful requests
            const actualPriceInt = convertPriceToDbFormat(actualPrice)
            
            // Refund the difference between max price and actual price
            const refundAmount = maxPriceInt - actualPriceInt
            if (refundAmount > 0) {
                await tx.user.update({
                    where: { id: key.user.id },
                    data: { credits: { increment: refundAmount } }
                })
            }
            
            // Update API usage entry with success and actual cost
            await tx.APIUsage.update({
                where: { id: usageLogEntry.id },
                data: {
                    speedMs: responseTime,
                    status: 'success',
                    cost: actualPriceInt // Update to actual cost
                }
            })
        })
        console.log('Usage updated, refunded', refundAmount)
        return true
    } catch (error) {
        console.error('Error updating API usage:', JSON.stringify(req.body), error)
        // Log the error but don't fail the response
        return false
    }
}