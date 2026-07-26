import { getRedis } from './redis'

function getCompletedRewriteCountKey(): string {
  const environment =
    process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development'

  // Preserve the deployed key so this cleanup does not reset production.
  return environment === 'production'
    ? 'views'
    : `rewritepal:${environment}:completed-rewrites:v1`
}

export async function getCompletedRewriteCount(): Promise<number> {
  return (await getRedis().get<number>(getCompletedRewriteCountKey())) ?? 0
}

export async function incrementCompletedRewriteCount(): Promise<number> {
  return getRedis().incr(getCompletedRewriteCountKey())
}
