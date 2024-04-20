export const runtime = 'edge'

import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await kv.get('views')
  return NextResponse.json(user)
}

export async function POST() {
  const user = await kv.incr('views')
  return NextResponse.json(user)
}
