import { getCompletedRewriteCount } from '@rewritepal/lib/server/rewrite-count'
import { NextResponse } from 'next/server'

const sharedCacheControl =
  'public, max-age=0, s-maxage=30, stale-while-revalidate=300'

export async function GET() {
  try {
    return NextResponse.json(await getCompletedRewriteCount(), {
      headers: { 'Cache-Control': sharedCacheControl },
    })
  } catch {
    console.error('rewrite_count.read_failed')
    return NextResponse.json(
      { error: 'Rewrite count unavailable.' },
      {
        headers: { 'Cache-Control': 'no-store' },
        status: 503,
      },
    )
  }
}
