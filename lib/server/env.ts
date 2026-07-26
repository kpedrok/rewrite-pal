import { z } from 'zod'

const redisEnvSchema = z.object({
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.url(),
})

const openAIEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
})

const rateLimitEnvSchema = redisEnvSchema.extend({
  RATE_LIMIT_HASH_SECRET: z.string().min(32),
})

const developmentRateLimitHashSecret =
  'rewritepal-development-only-rate-limit-secret'

function parseEnvironment<T>(
  schema: z.ZodType<T>,
  name: string,
  environment: unknown = process.env,
): T {
  const parsed = schema.safeParse(environment)

  if (!parsed.success) {
    const missingVariables = parsed.error.issues
      .map((issue) => issue.path.join('.'))
      .join(', ')
    throw new Error(`Invalid ${name} environment: ${missingVariables}`)
  }

  return parsed.data
}

export function getRedisEnv() {
  return parseEnvironment(redisEnvSchema, 'Redis')
}

export function getOpenAIEnv() {
  return parseEnvironment(openAIEnvSchema, 'OpenAI')
}

export function getRateLimitEnv() {
  const isDeployed =
    Boolean(process.env.VERCEL_ENV) || process.env.NODE_ENV === 'production'
  const environment =
    isDeployed || process.env.RATE_LIMIT_HASH_SECRET
      ? process.env
      : {
          ...process.env,
          RATE_LIMIT_HASH_SECRET: developmentRateLimitHashSecret,
        }

  return parseEnvironment(rateLimitEnvSchema, 'rate limit', environment)
}
