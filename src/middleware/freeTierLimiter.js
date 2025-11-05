import { prisma } from '../config/database.js'

// Daily free-tier limiter shared by all endpoints.
// Must be executed AFTER body parsing so that req.body.model is defined.
export const freeTierLimiter = async (req, res, next) => {
  const { model } = req.body || {}
  if (!model.includes(':free')) {
    // Paid model – no daily cap.
    return next()
  }

  const userId = res.locals.key.user.id
  const proxyCount = Number(process.env.PROXY_COUNT || 0)
  const clientIp = proxyCount > 0 ? req.headers['cf-connecting-ip'] : req.ip

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const whereCommon = {
      model: { contains: ':free' },
      createdAt: { gte: today }
    }

    // Skip per-user limit for the built-in anonymous user. We still enforce the IP limit.
    const [userUsage, ipUsage] = await Promise.all([
      userId === 'anon_user'
        ? Promise.resolve(0)
        : prisma.APIUsage.count({ where: { ...whereCommon, userId } }),
      prisma.APIUsage.count({ where: { ...whereCommon, ip: clientIp } })
    ])

    const hasCredits = (res.locals.key?.user?.credits ?? 0) > 0
    const dailyFreeLimit = hasCredits ? 50 : 10

    if (userUsage >= dailyFreeLimit || ipUsage >= dailyFreeLimit) {
      // Respond with a different message if the user has never deposited.
      const message = hasCredits
        ? `Daily limit of ${dailyFreeLimit} free requests reached. There is no limit on paid models, so you can continue by removing ":free" from the model name.`
        : `Daily limit of ${dailyFreeLimit} free requests reached. Please deposit any amount to get access to 50 daily free generations: https://imagerouter.io/pricing`

      const type = hasCredits ? 'rate_limit_error' : 'deposit_required'

      return res.status(hasCredits ? 429 : 403).json({
        error: {
          message,
          type
        }
      })
    }
  } catch (err) {
    console.error('Error in freeTierLimiter:', err)
    return res.status(500).json({
      error: {
        message: 'Failed to verify free-tier usage limit',
        type: 'internal_error'
      }
    })
  }

  next()
} 