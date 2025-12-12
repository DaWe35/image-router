// List of banned IP addresses (both IPv4 and IPv6)
const BANNED_IPS = new Set([
  '2607:f1c0:f010:2300::1',
  '2602:fea7:e0c:35::5',
  '2600:6c42:4b40:160a::b1',
  '2607:9000:b00:6:198:44:137:54',
  '2600:6c8e:8540:30::a',
  '2607:adc0:6:7::5',
  '2600:6c40:1300:9a0a:89b7:452d:beb4:8767',
  '2600:6c42:4b40:160a:d2cb:4b51:9eae:17c5',
  '2600:6c40:137f:580a:ad6a:218e:6c2e:9efa',
  '2607:f298:6:a034::50a:2182',
  '2607:f298:6:a034::704:7c24',
  '209.46.124.162',
  '2607:adc0:5::53'
])

/**
 * Middleware to block banned IP addresses from image and video generation
 */
export const blockBannedIPs = (req, res, next) => {
  // Extract client IP using the same pattern as other middleware
  const proxyCount = Number(process.env.PROXY_COUNT || 0)
  const clientIp = proxyCount > 0 ? req.headers['cf-connecting-ip'] : req.ip

  // Check if IP is banned
  if (clientIp && BANNED_IPS.has(clientIp)) {
    return res.status(403).json({
      error: {
        message: 'Access denied',
        type: 'access_denied'
      }
    })
  }

  // IP is not banned, continue
  next()
}

