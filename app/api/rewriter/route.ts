import { openai } from '@ai-sdk/openai'
import { buildRewriteSystemPrompt } from '@rewritepal/lib/rewrite/prompt'
import { rewriteRequestSchema } from '@rewritepal/lib/rewrite/schema'
import { getRewriteEnv } from '@rewritepal/lib/server/env'
import { limitRewrite } from '@rewritepal/lib/server/rate-limit'
import { incrementViewCount } from '@rewritepal/lib/server/views'
import { createTextStreamResponse, streamText, toTextStream } from 'ai'
import { after } from 'next/server'

export async function POST(req: Request): Promise<Response> {
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return new Response('Expected a JSON request.', { status: 415 })
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return new Response('Expected a valid JSON request.', { status: 400 })
    }

    const parsedRequest = rewriteRequestSchema.safeParse(body)

    if (!parsedRequest.success) {
      return new Response('Please provide valid rewrite options.', {
        status: 400,
      })
    }

    const { success, limit, reset, remaining } = await limitRewrite(req.headers)

    if (!success) {
      return createRateLimitExceededResponse(limit, remaining, reset)
    }

    getRewriteEnv()

    const { prompt } = parsedRequest.data

    const model = openai('gpt-4o-mini')
    const systemMessage = buildRewriteSystemPrompt(parsedRequest.data)

    const result = await streamText({
      model,
      system: systemMessage,
      prompt,
      temperature: 0.6,
      maxOutputTokens: 1500,
    })

    after(async () => {
      try {
        await result.text
        await incrementViewCount()
      } catch (error) {
        console.error('Unable to increment the view counter.', error)
      }
    })

    return createTextStreamResponse({
      stream: toTextStream({ stream: result.stream }),
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

function createRateLimitExceededResponse(
  limit: number,
  remaining: number,
  reset: number,
): Response {
  return new Response('You have reached your request limit for the day.', {
    status: 429,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
      'Retry-After': Math.max(
        0,
        Math.ceil((reset - Date.now()) / 1000),
      ).toString(),
    },
  })
}
