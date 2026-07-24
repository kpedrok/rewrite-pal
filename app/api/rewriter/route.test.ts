import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  after: vi.fn(),
  createTextStreamResponse: vi.fn(),
  getRewriteEnv: vi.fn(),
  incrementViewCount: vi.fn(),
  limitRewrite: vi.fn(),
  openai: vi.fn(),
  streamText: vi.fn(),
  toTextStream: vi.fn(),
}))

vi.mock('@ai-sdk/openai', () => ({ openai: mocks.openai }))
vi.mock('@rewritepal/lib/server/env', () => ({
  getRewriteEnv: mocks.getRewriteEnv,
}))
vi.mock('@rewritepal/lib/server/rate-limit', () => ({
  limitRewrite: mocks.limitRewrite,
}))
vi.mock('@rewritepal/lib/server/views', () => ({
  incrementViewCount: mocks.incrementViewCount,
}))
vi.mock('ai', () => ({
  createTextStreamResponse: mocks.createTextStreamResponse,
  streamText: mocks.streamText,
  toTextStream: mocks.toTextStream,
}))
vi.mock('next/server', () => ({ after: mocks.after }))

import { POST } from './route'

const validRequest = {
  language: 'English',
  prompt: 'Rewrite this sentence.',
  role: 'Standard',
  tones: [],
}

function createRequest(body: BodyInit) {
  return new Request('https://rewritepal.test/api/rewriter', {
    body,
    headers: { 'content-type': 'application/json' },
    method: 'POST',
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.getRewriteEnv.mockReturnValue({})
  mocks.limitRewrite.mockResolvedValue({
    limit: 50,
    remaining: 49,
    reset: Date.now() + 60_000,
    success: true,
  })
  mocks.openai.mockReturnValue('test-model')
  mocks.createTextStreamResponse.mockReturnValue(new Response('stream'))
  mocks.incrementViewCount.mockResolvedValue(1)
  mocks.toTextStream.mockReturnValue(new ReadableStream())
})

describe('POST /api/rewriter', () => {
  it('rejects malformed JSON before contacting infrastructure', async () => {
    const response = await POST(createRequest('{'))

    expect(response.status).toBe(400)
    expect(mocks.limitRewrite).not.toHaveBeenCalled()
  })

  it('rejects invalid rewrite options before contacting infrastructure', async () => {
    const response = await POST(
      createRequest(JSON.stringify({ ...validRequest, language: 'Klingon' })),
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

    const response = await POST(createRequest(JSON.stringify(validRequest)))

    expect(response.status).toBe(429)
    expect(response.headers.get('Retry-After')).toBeTruthy()
    expect(response.headers.get('X-RateLimit-Limit')).toBe('50')
    expect(mocks.streamText).not.toHaveBeenCalled()
  })

  it('returns a safe error when the provider fails', async () => {
    mocks.streamText.mockRejectedValue(new Error('provider unavailable'))

    const response = await POST(createRequest(JSON.stringify(validRequest)))

    expect(response.status).toBe(500)
    await expect(response.text()).resolves.toBe('Internal server error')
    expect(mocks.after).not.toHaveBeenCalled()
    expect(mocks.incrementViewCount).not.toHaveBeenCalled()
  })

  it('schedules a counter increment after a successful rewrite completes', async () => {
    mocks.streamText.mockResolvedValue({
      stream: new ReadableStream(),
      text: Promise.resolve('Rewritten text.'),
    })

    const response = await POST(createRequest(JSON.stringify(validRequest)))

    expect(response.status).toBe(200)
    expect(mocks.after).toHaveBeenCalledOnce()
    expect(mocks.incrementViewCount).not.toHaveBeenCalled()

    const scheduledWork = mocks.after.mock.calls[0]?.[0] as () => Promise<void>
    await scheduledWork()

    expect(mocks.incrementViewCount).toHaveBeenCalledOnce()
  })
})
