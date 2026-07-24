import { getViewCount } from '@rewritepal/lib/server/views'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json(await getViewCount())
  } catch (error) {
    console.error('Unable to read the view counter.', error)
    return NextResponse.json(
      { error: 'View counter unavailable.' },
      { status: 503 },
    )
  }
}
