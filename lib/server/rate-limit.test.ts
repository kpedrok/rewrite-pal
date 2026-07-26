import { describe, expect, it } from 'bun:test'
import { getClientIp, getRateLimitIdentifier } from './rate-limit'

const testSecret = 'a-test-only-secret-that-is-at-least-32-characters'

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

describe('getRateLimitIdentifier', () => {
  it('returns a stable digest without retaining the raw address', () => {
    const headers = new Headers({
      'x-vercel-forwarded-for': '203.0.113.10',
    })
    const identifier = getRateLimitIdentifier(headers, testSecret)

    expect(identifier).toHaveLength(64)
    expect(identifier).not.toContain('203.0.113.10')
    expect(getRateLimitIdentifier(headers, testSecret)).toBe(identifier)
  })

  it('changes when the address or deployment secret changes', () => {
    const firstHeaders = new Headers({
      'x-vercel-forwarded-for': '203.0.113.10',
    })
    const secondHeaders = new Headers({
      'x-vercel-forwarded-for': '203.0.113.11',
    })

    expect(getRateLimitIdentifier(firstHeaders, testSecret)).not.toBe(
      getRateLimitIdentifier(secondHeaders, testSecret),
    )
    expect(getRateLimitIdentifier(firstHeaders, testSecret)).not.toBe(
      getRateLimitIdentifier(firstHeaders, `${testSecret}-rotated`),
    )
  })
})
