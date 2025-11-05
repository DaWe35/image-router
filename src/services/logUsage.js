import { imageModels } from '../shared/imageModels/index.js'
import { videoModels } from '../shared/videoModels/index.js'
const models = {
    ...imageModels,
    ...videoModels
}
import { prisma } from '../config/database.js'
import { preCalcPrice, postCalcPrice, convertPriceToDbFormat } from '../shared/priceCalculator.js'

export async function preLogUsage(params, apiKey, req, providerIndex) {
    const modelConfig = models[params.model]

    const prePriceUsd = preCalcPrice(params.model, params.size, params.quality, providerIndex)
    const prePriceInt = convertPriceToDbFormat(prePriceUsd)
    
    // Check if the user has enough credits
    if (prePriceInt !== 0 && apiKey.user.credits < prePriceInt) {
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
                provider: modelConfig?.providers[providerIndex].id,
                prompt: params.prompt || '',
                cost: prePriceInt, // Initial cost is max price
                speedMs: 0,
                imageSize: params.size || 'unknown',
                quality: params.quality ? params.quality : 'auto',
                status: 'processing',
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


export async function postLogUsage(params, apiKey, usageLogEntry, imageResult, providerIndex) {
    const prePriceUsd = preCalcPrice(params.model, params.size, params.quality, providerIndex)
    const prePriceInt = convertPriceToDbFormat(prePriceUsd)

    const postPriceUsd = postCalcPrice(params.model, params.size, params.quality, imageResult, providerIndex)
    const postPriceInt = convertPriceToDbFormat(postPriceUsd)

    // Extract URLs from the result
    const outputUrls = extractOutputUrls(imageResult, usageLogEntry.id)

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
                    status: 'success',
                    cost: postPriceInt, // Update to actual cost
                    outputUrls: outputUrls
                }
            })
        })
        console.log('post-charged', postPriceUsd, 'for', params.model)
        return postPriceInt
    } catch (error) {
        console.error('Error in postLogUsage for image generation. Params:', JSON.stringify(params), '; Response:', JSON.stringify(imageResult), '; Error:', error)
        throw new Error('Failed to postlog usage for ' + params.model + ' ' + usageLogEntry.id)

    }
}

// Helper function to extract URLs from image/video generation result
function extractOutputUrls(result, usageLogId) {
    const urls = []
    
    if (!result || !result.data || !Array.isArray(result.data)) {
        return urls
    }
    
    for (const item of result.data) {
        let url = null
        
        // Check for URL (for url response format)
        if (item.url) {
            url = item.url
        }
        // Check for uploaded URL (for b64_json response format, preserved by storage service)
        else if (item._uploadedUrl) {
            url = item._uploadedUrl
        }
        
        if (url) {
            // Shorten URL by removing S3_CUSTOM_PUBLIC_URL and APIUsage row id
            const shortenedUrl = shortenUrl(url, usageLogId)
            urls.push(shortenedUrl)
        }
    }
    
    return urls
}

// Helper function to shorten URLs by removing S3_CUSTOM_PUBLIC_URL and APIUsage row id
function shortenUrl(url, usageLogId) { 
    const s3CustomPublicUrl = process.env.S3_CUSTOM_PUBLIC_URL
    if (!s3CustomPublicUrl) {
        return url
    }
    
    // Replace S3 URL + usage log ID with @ wildcard
    const expectedPrefix = `${s3CustomPublicUrl}/${usageLogId}`
    if (url.startsWith(expectedPrefix)) {
        return url.replace(expectedPrefix, '@')
    }
    
    // If URL doesn't match our pattern, return as-is
    return url
}