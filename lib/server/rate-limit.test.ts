import { describe, expect, it } from 'bun:test'
import { getClientIp } from './rate-limit'

describe('getClientIp', () => {
  it('uses the first address from Vercel’s trusted proxy header', () => {
    const headers = new Headers({
      'x-vercel-forwarded-for': '203.0.113.10, 70.41.3.18, 150.172.238.178',
    })

    expect(getClientIp(headers)).toBe('203.0.113.10')
  })

  it('does not trust a client-controlled forwarded-for header', () => {
    expect(
      getClientIp(new Headers({ 'x-forwarded-for': '203.0.113.10' })),
    ).toBe('unknown')
  })

  it('falls back when the trusted header is missing or blank', () => {
    expect(getClientIp(new Headers())).toBe('unknown')
    expect(getClientIp(new Headers({ 'x-vercel-forwarded-for': '   ' }))).toBe(
      'unknown',
    )
  })
})
