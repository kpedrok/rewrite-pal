import { z } from 'zod'

const redisEnvSchema = z.object({
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.url(),
})

const openAIEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
})

const rewriteEnvSchema = redisEnvSchema.extend(openAIEnvSchema.shape)

function parseEnvironment<T>(schema: z.ZodType<T>, name: string): T {
  const parsed = schema.safeParse(process.env)

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

export function getRewriteEnv() {
  return parseEnvironment(rewriteEnvSchema, 'rewrite')
}
