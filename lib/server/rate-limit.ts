import { createHmac } from 'node:crypto'
import { Ratelimit } from '@upstash/ratelimit'
import { getRateLimitEnv } from './env'
import { getRedis } from './redis'

let rewriteRateLimit: Ratelimit | undefined

function getRewriteRateLimit(): Ratelimit {
  if (!rewriteRateLimit) {
    const environment =
      process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development'

    rewriteRateLimit = new Ratelimit({
      limiter: Ratelimit.slidingWindow(50, '1 h'),
      prefix: `rewritepal:${environment}:ratelimit:rewrite:v1`,
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

export function getRateLimitIdentifier(
  headers: Headers,
  secret: string,
): string {
  return createHmac('sha256', secret).update(getClientIp(headers)).digest('hex')
}

export function limitRewrite(headers: Headers) {
  const { RATE_LIMIT_HASH_SECRET } = getRateLimitEnv()
  return getRewriteRateLimit().limit(
    getRateLimitIdentifier(headers, RATE_LIMIT_HASH_SECRET),
  )
}
