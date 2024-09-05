import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

// export const runtime = 'edge'
export const revalidate = 60
const redis = Redis.fromEnv()

const path = 'views'

export async function GET() {
  const views = await redis.get(path)
  return NextResponse.json(views)
}

export async function POST() {
  const user = await redis.incr(path)
  return NextResponse.json(user)
}
