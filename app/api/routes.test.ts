import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

const mocks = {
  after: mock(),
  createRewriteStream: mock(),
  createRewriteTextResponse: mock(),
  getRewriteEnv: mock(),
  getViewCount: mock(),
  incrementViewCount: mock(),
  limitRewrite: mock(),
}

spyOn(console, 'error').mockImplementation(() => undefined)

mock.module('@rewritepal/lib/server/env', () => ({
  getRewriteEnv: mocks.getRewriteEnv,
}))
mock.module('@rewritepal/lib/server/rate-limit', () => ({
  limitRewrite: mocks.limitRewrite,
}))
mock.module('@rewritepal/lib/server/rewrite-stream', () => ({
  createRewriteStream: mocks.createRewriteStream,
  createRewriteTextResponse: mocks.createRewriteTextResponse,
}))
mock.module('@rewritepal/lib/server/views', () => ({
  getViewCount: mocks.getViewCount,
  incrementViewCount: mocks.incrementViewCount,
}))
mock.module('next/server', () => ({
  NextResponse: { json: Response.json },
  after: mocks.after,
}))

const { POST: rewritePost } = await import('./rewriter/route')
const { GET: viewsGet } = await import('./views/route')

const validRequest = {
  language: 'English',
  prompt: 'Rewrite this sentence.',
  role: 'Standard',
  tones: [],
}

function createRewriteRequest(body: BodyInit) {
  return new Request('https://rewritepal.test/api/rewriter', {
    body,
    headers: { 'content-type': 'application/json' },
    method: 'POST',
  })
}

beforeEach(() => {
  for (const value of Object.values(mocks)) {
    value.mockReset()
  }

  mocks.getRewriteEnv.mockReturnValue({})
  mocks.limitRewrite.mockResolvedValue({
    limit: 50,
    remaining: 49,
    reset: Date.now() + 60_000,
    success: true,
  })
  mocks.createRewriteTextResponse.mockReturnValue(new Response('stream'))
  mocks.incrementViewCount.mockResolvedValue(1)
})

describe('POST /api/rewriter', () => {
  it('rejects malformed JSON before contacting infrastructure', async () => {
    const response = await rewritePost(createRewriteRequest('{'))

    expect(response.status).toBe(400)
    expect(mocks.limitRewrite).not.toHaveBeenCalled()
  })

  it('rejects invalid rewrite options before contacting infrastructure', async () => {
    const response = await rewritePost(
      createRewriteRequest(
        JSON.stringify({ ...validRequest, language: 'Klingon' }),
      ),
    )

    expect(response.status).toBe(400)
    expect(mocks.limitRewrite).not.toHaveBeenCalled()
  })

  it('returns rate-limit headers when the client quota is exhausted', async () => {
    mocks.limitRewrite.mockResolvedValue({
      limit: 50,
      remaining: 0,
      reset: Date.now() + 60_000,
      success: false,
    })

    const response = await rewritePost(
      createRewriteRequest(JSON.stringify(validRequest)),
    )

    expect(response.status).toBe(429)
    expect(response.headers.get('Retry-After')).toBeTruthy()
    expect(response.headers.get('X-RateLimit-Limit')).toBe('50')
    expect(mocks.createRewriteStream).not.toHaveBeenCalled()
  })

  it('returns a safe error when the provider fails', async () => {
    mocks.createRewriteStream.mockImplementation(() => {
      throw new Error('provider unavailable')
    })

    const response = await rewritePost(
      createRewriteRequest(JSON.stringify(validRequest)),
    )

    expect(response.status).toBe(500)
    await expect(response.text()).resolves.toBe('Internal server error')
    expect(mocks.after).not.toHaveBeenCalled()
    expect(mocks.incrementViewCount).not.toHaveBeenCalled()
  })

  it('schedules a counter increment after a successful rewrite completes', async () => {
    mocks.createRewriteStream.mockReturnValue({
      stream: new ReadableStream(),
      text: Promise.resolve('Rewritten text.'),
    })

    const response = await rewritePost(
      createRewriteRequest(JSON.stringify(validRequest)),
    )

    expect(response.status).toBe(200)
    expect(mocks.after).toHaveBeenCalledTimes(1)
    expect(mocks.incrementViewCount).not.toHaveBeenCalled()

    const scheduledWork = mocks.after.mock.calls[0]?.[0] as () => Promise<void>
    await scheduledWork()

    expect(mocks.incrementViewCount).toHaveBeenCalledTimes(1)
  })
})

describe('GET /api/views', () => {
  it('returns zero when the counter has not been initialized', async () => {
    mocks.getViewCount.mockResolvedValue(0)

    const response = await viewsGet()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toBe(0)
  })

  it('returns a safe response when Redis is unavailable', async () => {
    mocks.getViewCount.mockRejectedValue(new Error('Redis unavailable'))

    const response = await viewsGet()

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: 'View counter unavailable.',
    })
  })
})
