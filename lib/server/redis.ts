import { Redis } from '@upstash/redis'
import { getRedisEnv } from './env'

let redis: Redis | undefined

export function getRedis(): Redis {
  if (!redis) {
    const env = getRedisEnv()
    redis = new Redis({
      token: env.UPSTASH_REDIS_REST_TOKEN,
      url: env.UPSTASH_REDIS_REST_URL,
    })
  }

  return redis
}
