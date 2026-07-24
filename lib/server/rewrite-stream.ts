import { openai } from '@ai-sdk/openai'
import { createTextStreamResponse, streamText, toTextStream } from 'ai'

type RewriteStreamOptions = {
  prompt: string
  system: string
}

export function createRewriteStream({ prompt, system }: RewriteStreamOptions) {
  return streamText({
    maxOutputTokens: 1500,
    model: openai('gpt-4o-mini'),
    prompt,
    system,
    temperature: 0.6,
  })
}

export function createRewriteTextResponse(
  result: ReturnType<typeof createRewriteStream>,
): Response {
  return createTextStreamResponse({
    stream: toTextStream({ stream: result.stream }),
  })
}
