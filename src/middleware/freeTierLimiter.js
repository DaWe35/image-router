import { prisma } from '../config/database.js'

// Daily free-tier limiter shared by all endpoints.
// Must be executed AFTER body parsing so that req.body.model is defined.
export const freeTierLimiter = async (req, res, next) => {
  if (!res.locals.key) {
    // No validated API key – nothing to do here; any missing/invalid key
    // should already be handled earlier in the middleware chain.
    return next()
  }

  const { model } = req.body || {}
  if (!model) {
    return res.status(400).json({
      error: {
        message: "Missing required 'model' parameter in freeTierLimiter()",
        type: 'invalid_request'
      }
    })
  }

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

    const [userUsage, ipUsage] = await Promise.all([
      prisma.APIUsage.count({ where: { ...whereCommon, userId } }),
      prisma.APIUsage.count({ where: { ...whereCommon, ip: clientIp } })
    ])

    const dailyFreeLimit = 30

    if (userUsage >= dailyFreeLimit || ipUsage >= dailyFreeLimit) {
      return res.status(429).json({
        error: {
          message: `Daily limit of ${dailyFreeLimit} free requests reached. There is no limit on paid models.`,
          type: 'rate_limit_error'
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