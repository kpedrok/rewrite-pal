import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getViewCount: vi.fn(),
}))

vi.mock('@rewritepal/lib/server/views', () => ({
  getViewCount: mocks.getViewCount,
}))

import { GET } from './route'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/views', () => {
  it('returns zero when the counter has not been initialized', async () => {
    mocks.getViewCount.mockResolvedValue(0)

    const response = await GET()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toBe(0)
  })

  it('returns a safe response when Redis is unavailable', async () => {
    mocks.getViewCount.mockRejectedValue(new Error('Redis unavailable'))

    const response = await GET()

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: 'View counter unavailable.',
    })
  })
})
