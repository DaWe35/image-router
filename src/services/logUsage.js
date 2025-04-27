import { models } from '../shared/models/index.js'
import { prisma } from '../config/database.js'
import { preCalcPrice, convertPriceToDbFormat } from '../shared/priceCalculator.js'

export async function preLogUsage(params, apiKey) {
    const modelConfig = models[params.model]

    const maxPriceUsd = preCalcPrice(params.model, params.size, params.quality)
    const maxPriceInt = convertPriceToDbFormat(maxPriceUsd)
    
    // Check if the user has enough credits
    if (apiKey.user.credits < maxPriceInt) {
        throw new Error('Insufficient credits (this model needs minimum $' + maxPriceUsd + ' credits), please topup your ImageRouter account: https://ir.myqa.cc/pricing')
    }

    if (apiKey.user.isActive === false) {
        throw new Error('Your account is inactive, please contact support')
    }

    if (apiKey.user.id === null) {
        throw new Error('Your account is not registered, please contact support')
    }

    if (apiKey.id === null && apiKey.apiKeyTempJwt === false) {
        throw new Error('Your API key is not found, please contact support')
    }

    // Use a transaction to ensure both operations succeed or fail together
    const usageLogEntry = await prisma.$transaction(async (tx) => {
        // Deduct maximum estimated credits initially
        await tx.user.update({
            where: { id: apiKey.user.id },
            data: { credits: { decrement: maxPriceInt } }
        })

        // Create API usage entry
        return await tx.APIUsage.create({
            data: {
                apiKeyId: apiKey.id || undefined,
                apiKeyTempJwt: apiKey.apiKeyTempJwt,
                userId: apiKey.user.id,
                model: params.model,
                provider: modelConfig?.providers[0],
                prompt: params.prompt || '',
                cost: maxPriceInt, // Initial cost is max price
                speedMs: 0,
                imageSize: params.size || 'unknown',
                status: 'processing'
            }
        })
    })
    return usageLogEntry
}

export async function refundUsage(apiKey, usageLogEntry, errorToLog) {
    try {            
        // Use a transaction to update both user balance and API usage together
        await prisma.$transaction(async (tx) => {
            // Refund the full amount if request failed
            await tx.user.update({
                where: { id: apiKey.user.id },
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


export async function postLogUsage(params, apiKey, usageLogEntry, actualPriceInt, latency) {
    const maxPriceUsd = preCalcPrice(params.model, params.size, params.quality)
    const maxPriceInt = convertPriceToDbFormat(maxPriceUsd)

    try {
        // Use a transaction to update both user balance and API usage together
        await prisma.$transaction(async (tx) => {
            // Refund the difference between max price and actual price
            const refundAmount = maxPriceInt - actualPriceInt
            if (refundAmount != 0) {
                await tx.user.update({
                    where: { id: apiKey.user.id },
                    data: { credits: { increment: refundAmount } }
                })
            }
            
            // Update API usage entry with success and actual cost
            await tx.APIUsage.update({
                where: { id: usageLogEntry.id },
                data: {
                    speedMs: latency,
                    status: 'success',
                    cost: actualPriceInt // Update to actual cost
                }
            })
        })
        return true
    } catch (error) {
        console.error('Error updating API usage. Params:', JSON.stringify(params), error)
        // Log the error but don't fail the response
        return false
    }
}