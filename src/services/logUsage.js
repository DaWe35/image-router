import { models } from '../shared/models/index.js'
import { prisma } from '../config/database.js'
import { preCalcPrice, postCalcPrice, convertPriceToDbFormat } from '../shared/priceCalculator.js'

export async function preLogUsage(params, apiKey) {
    const modelConfig = models[params.model]

    const prePriceUsd = preCalcPrice(params.model, params.size, params.quality)
    const prePriceInt = convertPriceToDbFormat(prePriceUsd)
    
    // Check if the user has enough credits
    if (apiKey.user.credits < prePriceInt) {
        throw new Error('Insufficient credits (this model needs minimum $' + prePriceUsd + ' credits), please topup your ImageRouter account: https://ir.myqa.cc/pricing')
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
            data: { credits: { decrement: prePriceInt } }
        })

        // Create API usage entry
        return await tx.APIUsage.create({
            data: {
                apiKeyId: apiKey.id || undefined,
                apiKeyTempJwt: apiKey.apiKeyTempJwt,
                userId: apiKey.user.id,
                model: params.model,
                provider: modelConfig?.providers[0].id,
                prompt: params.prompt || '',
                cost: prePriceInt, // Initial cost is max price
                speedMs: 0,
                imageSize: params.size || 'unknown',
                quality: params.quality ? params.quality : 'auto',
                status: 'processing'
            }
        })
    })
    console.log('pre-charged', prePriceUsd)
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


export async function postLogUsage(params, apiKey, usageLogEntry, imageResult) {
    const prePriceUsd = preCalcPrice(params.model, params.size, params.quality)
    const prePriceInt = convertPriceToDbFormat(prePriceUsd)

    const postPriceUsd = postCalcPrice(params.model, params.size, params.quality, imageResult)
    const postPriceInt = convertPriceToDbFormat(postPriceUsd)

    try {
        // Use a transaction to update both user balance and API usage together
        await prisma.$transaction(async (tx) => {
            // Refund the difference between max price and actual price
            const refundAmount = prePriceInt - postPriceInt
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
                    speedMs: imageResult.latency,
                    status: 'success',
                    cost: postPriceInt // Update to actual cost
                }
            })
        })
        console.log('post-charged', postPriceUsd)
        return postPriceInt
    } catch (error) {
        console.error('Error in postLogUsage for image generation:', JSON.stringify(params), error)
        throw new Error('Failed to postlog usage')

    }
}