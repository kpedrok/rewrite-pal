export const runtime = 'edge'
import { Redis } from '@upstash/redis'

import { NextResponse } from 'next/server'

const redis = Redis.fromEnv()

export async function GET() {
  const user = await redis.get('views')
  return NextResponse.json(user)
}

export async function POST() {
  const user = await redis.incr('views')
  return NextResponse.json(user)
}
