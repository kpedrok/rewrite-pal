import { Ratelimit } from '@upstash/ratelimit'
import { getRedis } from './redis'

let rewriteRateLimit: Ratelimit | undefined

function getRewriteRateLimit(): Ratelimit {
  if (!rewriteRateLimit) {
    rewriteRateLimit = new Ratelimit({
      analytics: true,
      limiter: Ratelimit.slidingWindow(50, '1 h'),
      redis: getRedis(),
    })
  }

  return rewriteRateLimit
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  )
}

export function limitRewrite(headers: Headers) {
  return getRewriteRateLimit().limit(`rewrite:${getClientIp(headers)}`)
}
