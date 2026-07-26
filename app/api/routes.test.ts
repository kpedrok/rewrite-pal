import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

const mocks = {
  after: mock(),
  createRewriteStream: mock(),
  createRewriteTextResponse: mock(),
  getOpenAIEnv: mock(),
  getCompletedRewriteCount: mock(),
  incrementCompletedRewriteCount: mock(),
  limitRewrite: mock(),
}

const consoleErrorSpy = spyOn(console, 'error').mockImplementation(
  () => undefined,
)

mock.module('@rewritepal/lib/server/env', () => ({
  getOpenAIEnv: mocks.getOpenAIEnv,
}))
mock.module('@rewritepal/lib/server/rate-limit', () => ({
  limitRewrite: mocks.limitRewrite,
}))
mock.module('@rewritepal/lib/server/rewrite-stream', () => ({
  createRewriteStream: mocks.createRewriteStream,
  createRewriteTextResponse: mocks.createRewriteTextResponse,
}))
mock.module('@rewritepal/lib/server/rewrite-count', () => ({
  getCompletedRewriteCount: mocks.getCompletedRewriteCount,
  incrementCompletedRewriteCount: mocks.incrementCompletedRewriteCount,
}))
mock.module('next/server', () => ({
  NextResponse: { json: Response.json },
  after: mocks.after,
}))

const { POST: rewritePost } = await import('./rewriter/route')
const { GET: rewriteCountGet } = await import('./rewrite-count/route')

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
  consoleErrorSpy.mockClear()

  for (const value of Object.values(mocks)) {
    value.mockReset()
  }

  mocks.getOpenAIEnv.mockReturnValue({})
  mocks.limitRewrite.mockResolvedValue({
    limit: 50,
    remaining: 49,
    reset: Date.now() + 60_000,
    success: true,
  })
  mocks.createRewriteTextResponse.mockReturnValue(new Response('stream'))
  mocks.incrementCompletedRewriteCount.mockResolvedValue(1)
})

describe('POST /api/rewriter', () => {
  it('charges malformed JSON to protect parsing resources', async () => {
    const response = await rewritePost(createRewriteRequest('{'))

    expect(response.status).toBe(400)
    expect(mocks.limitRewrite).toHaveBeenCalledTimes(1)
  })

  it('charges invalid rewrite options to protect validation resources', async () => {
    const response = await rewritePost(
      createRewriteRequest(
        JSON.stringify({ ...validRequest, language: 'Klingon' }),
      ),
    )

    expect(response.status).toBe(400)
    expect(mocks.limitRewrite).toHaveBeenCalledTimes(1)
  })

  it('rejects oversized request bodies after rate limiting', async () => {
    const response = await rewritePost(
      createRewriteRequest(
        JSON.stringify({ ...validRequest, prompt: 'x'.repeat(50_000) }),
      ),
    )

    expect(response.status).toBe(413)
    expect(mocks.limitRewrite).toHaveBeenCalledTimes(1)
    expect(mocks.createRewriteStream).not.toHaveBeenCalled()
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
    await expect(response.text()).resolves.toBe(
      'You have reached the rewrite limit. Try again later.',
    )
    expect(response.headers.get('Retry-After')).toBeTruthy()
    expect(response.headers.get('X-RateLimit-Limit')).toBe('50')
    expect(mocks.createRewriteStream).not.toHaveBeenCalled()
  })

  it('returns a safe error when the provider fails', async () => {
    mocks.createRewriteStream.mockImplementation(() => {
      throw new Error('provider unavailable for private user text')
    })

    const response = await rewritePost(
      createRewriteRequest(JSON.stringify(validRequest)),
    )

    expect(response.status).toBe(500)
    await expect(response.text()).resolves.toBe('Internal server error')
    expect(mocks.after).not.toHaveBeenCalled()
    expect(mocks.incrementCompletedRewriteCount).not.toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalledWith('rewrite.request_failed')
    expect(consoleErrorSpy.mock.calls.flat().join(' ')).not.toContain(
      'private user text',
    )
  })

  it('schedules a counter increment after a successful rewrite completes', async () => {
    mocks.createRewriteStream.mockReturnValue({
      stream: new ReadableStream(),
      text: Promise.resolve('Rewritten text.'),
    })

    const request = createRewriteRequest(JSON.stringify(validRequest))
    const response = await rewritePost(request)

    expect(response.status).toBe(200)
    expect(mocks.after).toHaveBeenCalledTimes(1)
    expect(mocks.incrementCompletedRewriteCount).not.toHaveBeenCalled()
    expect(mocks.createRewriteStream).toHaveBeenCalledWith(
      expect.objectContaining({ abortSignal: request.signal }),
    )

    const scheduledWork = mocks.after.mock.calls[0]?.[0] as () => Promise<void>
    await scheduledWork()

    expect(mocks.incrementCompletedRewriteCount).toHaveBeenCalledTimes(1)
  })

  it('does not increment the counter when the streamed rewrite fails', async () => {
    mocks.createRewriteStream.mockReturnValue({
      stream: new ReadableStream(),
      text: Promise.reject(new Error('stream interrupted')),
    })

    const response = await rewritePost(
      createRewriteRequest(JSON.stringify(validRequest)),
    )

    expect(response.status).toBe(200)
    const scheduledWork = mocks.after.mock.calls[0]?.[0] as () => Promise<void>
    await scheduledWork()

    expect(mocks.incrementCompletedRewriteCount).not.toHaveBeenCalled()
  })

  it('does not log an expected client cancellation', async () => {
    const abortError = new Error('request canceled')
    abortError.name = 'AbortError'
    mocks.createRewriteStream.mockReturnValue({
      stream: new ReadableStream(),
      text: Promise.reject(abortError),
    })

    await rewritePost(createRewriteRequest(JSON.stringify(validRequest)))
    const scheduledWork = mocks.after.mock.calls[0]?.[0] as () => Promise<void>
    await scheduledWork()

    expect(mocks.incrementCompletedRewriteCount).not.toHaveBeenCalled()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  it('keeps a counter failure separate from rewrite completion', async () => {
    mocks.createRewriteStream.mockReturnValue({
      stream: new ReadableStream(),
      text: Promise.resolve('Rewritten text.'),
    })
    mocks.incrementCompletedRewriteCount.mockRejectedValue(
      new Error('Redis unavailable'),
    )

    const response = await rewritePost(
      createRewriteRequest(JSON.stringify(validRequest)),
    )
    const scheduledWork = mocks.after.mock.calls[0]?.[0] as () => Promise<void>
    await scheduledWork()

    expect(response.status).toBe(200)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'rewrite.counter_increment_failed',
    )
  })
})

describe('GET /api/rewrite-count', () => {
  it('returns zero when the counter has not been initialized', async () => {
    mocks.getCompletedRewriteCount.mockResolvedValue(0)

    const response = await rewriteCountGet()

    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe(
      'public, max-age=0, s-maxage=30, stale-while-revalidate=300',
    )
    await expect(response.json()).resolves.toBe(0)
  })

  it('returns a safe response when Redis is unavailable', async () => {
    mocks.getCompletedRewriteCount.mockRejectedValue(
      new Error('Redis unavailable'),
    )

    const response = await rewriteCountGet()

    expect(response.status).toBe(503)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    await expect(response.json()).resolves.toEqual({
      error: 'Rewrite count unavailable.',
    })
  })
})
