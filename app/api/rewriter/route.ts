import { buildRewriteSystemPrompt } from '@rewritepal/lib/rewrite/prompt'
import { rewriteRequestSchema } from '@rewritepal/lib/rewrite/schema'
import { getRewriteEnv } from '@rewritepal/lib/server/env'
import { limitRewrite } from '@rewritepal/lib/server/rate-limit'
import {
  JsonRequestError,
  readJsonRequest,
} from '@rewritepal/lib/server/request'
import {
  createRewriteStream,
  createRewriteTextResponse,
} from '@rewritepal/lib/server/rewrite-stream'
import { incrementViewCount } from '@rewritepal/lib/server/views'
import { after } from 'next/server'

const maximumRewriteRequestBytes = 48 * 1024

export async function POST(req: Request): Promise<Response> {
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return new Response('Expected a JSON request.', { status: 415 })
    }

    const { success, limit, reset, remaining } = await limitRewrite(req.headers)

    if (!success) {
      return createRateLimitExceededResponse(limit, remaining, reset)
    }

    let body: unknown
    try {
      body = await readJsonRequest(req, maximumRewriteRequestBytes)
    } catch (error) {
      if (error instanceof JsonRequestError) {
        return new Response(error.message, { status: error.status })
      }

      throw error
    }

    const parsedRequest = rewriteRequestSchema.safeParse(body)

    if (!parsedRequest.success) {
      return new Response('Please provide valid rewrite options.', {
        status: 400,
      })
    }

    getRewriteEnv()

    const { prompt } = parsedRequest.data

    const systemMessage = buildRewriteSystemPrompt(parsedRequest.data)
    const result = createRewriteStream({ prompt, system: systemMessage })

    after(async () => {
      try {
        await result.text
        await incrementViewCount()
      } catch (error) {
        console.error('Unable to increment the view counter.', error)
      }
    })

    return createRewriteTextResponse(result)
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
