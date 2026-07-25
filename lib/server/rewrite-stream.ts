import {
  createRewriteGenerationOptions,
  type RewriteGenerationInput,
} from '@rewritepal/lib/server/rewrite-generation'
import { createTextStreamResponse, streamText, toTextStream } from 'ai'

export function createRewriteStream(input: RewriteGenerationInput) {
  return streamText(createRewriteGenerationOptions(input))
}

export function createRewriteTextResponse(
  result: ReturnType<typeof createRewriteStream>,
): Response {
  return createTextStreamResponse({
    stream: toTextStream({ stream: result.stream }),
  })
}
