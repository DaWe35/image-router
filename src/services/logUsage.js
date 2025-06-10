import { imageModels } from '../shared/imageModels/index.js'
import { videoModels } from '../shared/videoModels/index.js'
const models = {
    ...imageModels,
    ...videoModels
}
import { prisma } from '../config/database.js'
import { Status } from '@prisma/client'
import { preCalcPrice, postCalcPrice, convertPriceToDbFormat } from '../shared/priceCalculator.js'

export async function preLogUsage(params, apiKey, req) {
    const modelConfig = models[params.model]

    const prePriceUsd = preCalcPrice(params.model, params.size, params.quality)
    const prePriceInt = convertPriceToDbFormat(prePriceUsd)
    
    // Check if the user has enough credits
    if (apiKey.user.credits < prePriceInt) {
        throw new Error(`Insufficient credits (this model needs minimum $${prePriceUsd} credits), please topup your ImageRouter account: https://imagerouter.io/pricing`)
    }

    if (apiKey.user.isActive === false) {
        throw new Error('Your account is inactive, please contact support')
    }

    if (apiKey.user.id === null) {
        throw new Error('Your account is not registered, please contact support')
    }

    if (apiKey.id === null && apiKey.apiKeyTempJwt === false) {
        throw new Error('API key is not found, please contact support')
    }

    // Get client IP
    const clientIp = process.env.PROXY_COUNT > 0 ? req?.headers['cf-connecting-ip'] : req?.ip

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
                status: Status.processing,
                ip: clientIp
            }
        })
    })
    console.log('pre-charged', prePriceUsd, 'for', params.model)
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
                    status: Status.error,
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

    // Extract URLs from the result
    const outputUrls = extractOutputUrls(imageResult)

    try {
        // Use a transaction to update both user balance and API usage together
        await prisma.$transaction(async (tx) => {
            // Refund the difference between max price and actual price
            const refundAmount = prePriceInt - postPriceInt
            if (refundAmount !== 0) {
                await tx.user.update({
                    where: { id: apiKey.user.id },
                    data: { credits: { increment: refundAmount } }
                })
            }
            
            // Update API usage entry with success, actual cost, and output URLs
            await tx.APIUsage.update({
                where: { id: usageLogEntry.id },
                data: {
                    speedMs: imageResult.latency,
                    status: Status.success,
                    cost: postPriceInt, // Update to actual cost
                    outputUrls: outputUrls
                }
            })
        })
        console.log('post-charged', postPriceUsd, 'for', params.model)
        return postPriceInt
    } catch (error) {
        console.error('Error in postLogUsage for image generation:', JSON.stringify(params), error)
        throw new Error('Failed to postlog usage')

    }
}

// Helper function to extract URLs from image/video generation result
function extractOutputUrls(result) {
    const urls = []
    
    if (!result || !result.data || !Array.isArray(result.data)) {
        return urls
    }
    
    for (const item of result.data) {
        // Check for URL (for url response format)
        if (item.url) {
            urls.push(item.url)
        }
        // Check for uploaded URL (for b64_json response format, preserved by storage service)
        else if (item._uploadedUrl) {
            urls.push(item._uploadedUrl)
        }
    }
    
    return urls
}