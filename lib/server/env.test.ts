import { afterEach, describe, expect, it } from 'bun:test'
import { getRateLimitEnv } from './env'

const originalEnvironment = {
  NODE_ENV: process.env.NODE_ENV,
  RATE_LIMIT_HASH_SECRET: process.env.RATE_LIMIT_HASH_SECRET,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  VERCEL_ENV: process.env.VERCEL_ENV,
}

afterEach(() => {
  restoreEnvironmentVariable('NODE_ENV', originalEnvironment.NODE_ENV)
  restoreEnvironmentVariable(
    'RATE_LIMIT_HASH_SECRET',
    originalEnvironment.RATE_LIMIT_HASH_SECRET,
  )
  restoreEnvironmentVariable(
    'UPSTASH_REDIS_REST_TOKEN',
    originalEnvironment.UPSTASH_REDIS_REST_TOKEN,
  )
  restoreEnvironmentVariable(
    'UPSTASH_REDIS_REST_URL',
    originalEnvironment.UPSTASH_REDIS_REST_URL,
  )
  restoreEnvironmentVariable('VERCEL_ENV', originalEnvironment.VERCEL_ENV)
})

describe('getRateLimitEnv', () => {
  it('uses a development-only hash secret outside deployed environments', () => {
    configureRedisEnvironment()
    setEnvironmentVariable('NODE_ENV', 'development')
    delete process.env.RATE_LIMIT_HASH_SECRET
    delete process.env.VERCEL_ENV

    expect(
      getRateLimitEnv().RATE_LIMIT_HASH_SECRET.length,
    ).toBeGreaterThanOrEqual(32)
  })

  it('requires an explicit hash secret in deployed environments', () => {
    configureRedisEnvironment()
    setEnvironmentVariable('NODE_ENV', 'production')
    delete process.env.RATE_LIMIT_HASH_SECRET

    expect(() => getRateLimitEnv()).toThrow('RATE_LIMIT_HASH_SECRET')
  })
})

function configureRedisEnvironment() {
  setEnvironmentVariable('UPSTASH_REDIS_REST_TOKEN', 'test-token')
  setEnvironmentVariable('UPSTASH_REDIS_REST_URL', 'https://example.com')
}

function setEnvironmentVariable(name: string, value: string) {
  process.env[name] = value
}

function restoreEnvironmentVariable(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name]
    return
  }

  process.env[name] = value
}
