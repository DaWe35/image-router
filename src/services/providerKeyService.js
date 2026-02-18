import { prisma } from '../config/database.js'

const EXHAUSTED_PATTERNS = [
    'insufficient_quota',
    'usage_limit_exceeded',
    'credit',
    'balance',
    'quota',
    'This API method requires billing to be enabled',
]

function isExhaustedError(message) {
    const lower = message.toLowerCase()
    return EXHAUSTED_PATTERNS.some(p => lower.includes(p))
}

/**
 * Fetch a random ACTIVE key for a provider.
 *
 * @param {'GEMINI' | 'RUNWARE' | 'VERTEX'} provider
 * @returns {Promise<string>} The raw API key string
 */
export async function getProviderKey(provider) {
    if (!prisma) {
        throw new Error(`No database connection – cannot retrieve ${provider} key`)
    }

    const rows = await prisma.$queryRaw`
        SELECT id, "apiKey"
        FROM "ProviderApiKey"
        WHERE provider = ${provider}::"ProviderType" AND status = 'ACTIVE'::"ProviderKeyStatus"
        ORDER BY RANDOM()
        LIMIT 1
    `

    if (!rows.length) {
        throw new Error(`No active ${provider} API key found in ProviderApiKey table`)
    }

    const row = rows[0]

    // Fire-and-forget: mark as used
    prisma.providerApiKey.update({
        where: { id: row.id },
        data: { lastUsedAt: new Date() },
    }).catch(err => console.error(`Failed to update lastUsedAt for ${provider} key ${row.id}:`, err))

    return row.apiKey
}

/**
 * Record an error against a provider key so operators can see which keys are failing.
 *
 * @param {'GEMINI' | 'RUNWARE' | 'VERTEX'} provider
 * @param {string} apiKey   The raw key string (used to look up the row)
 * @param {string} message  Human-readable error description
 */
export async function reportProviderKeyError(provider, apiKey, message) {
    if (!prisma) return

    try {
        const row = await prisma.providerApiKey.findFirst({
            where: { provider, apiKey },
            select: { id: true },
        })

        if (!row) return

        const data = {
            lastErrorAt: new Date(),
            lastErrorMessage: String(message).slice(0, 1000),
        }

        if (isExhaustedError(message)) {
            data.status = 'EXHAUSTED'
            console.log(`Marking ${provider} key ${row.id} as EXHAUSTED: ${message}`)
        }

        await prisma.providerApiKey.update({ where: { id: row.id }, data })
    } catch (err) {
        console.error(`Failed to report error for ${provider} key:`, err)
    }
}
