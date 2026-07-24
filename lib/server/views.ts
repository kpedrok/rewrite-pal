import { getRedis } from './redis'

const viewsKey = 'views'

export async function getViewCount(): Promise<number> {
  return (await getRedis().get<number>(viewsKey)) ?? 0
}

export async function incrementViewCount(): Promise<number> {
  return getRedis().incr(viewsKey)
}
