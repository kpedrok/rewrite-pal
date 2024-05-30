export const runtime = 'edge'
import { Redis } from '@upstash/redis'

import { NextRequest, NextResponse } from 'next/server'

const redis = Redis.fromEnv()

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as {
    email?: string
  }
  const user = await redis.sadd('emails-download', email)
  return NextResponse.json(user)
}
