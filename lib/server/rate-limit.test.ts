import { describe, expect, it } from 'vitest'
import { getClientIp } from './rate-limit'

describe('getClientIp', () => {
  it('uses the first address in a forwarded-for header', () => {
    const headers = new Headers({
      'x-forwarded-for': '203.0.113.10, 70.41.3.18, 150.172.238.178',
    })

    expect(getClientIp(headers)).toBe('203.0.113.10')
  })

  it('falls back when the forwarded-for header is missing or blank', () => {
    expect(getClientIp(new Headers())).toBe('unknown')
    expect(getClientIp(new Headers({ 'x-forwarded-for': '   ' }))).toBe(
      'unknown',
    )
  })
})
