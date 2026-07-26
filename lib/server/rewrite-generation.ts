import { openai } from '@ai-sdk/openai'

export const rewriteModelId = 'gpt-4o-mini'
const rewriteTimeoutMs = 60_000

export type RewriteGenerationInput = {
  abortSignal?: AbortSignal
  prompt: string
  system: string
}

export function createRewriteGenerationOptions({
  abortSignal,
  prompt,
  system,
}: RewriteGenerationInput) {
  return {
    abortSignal,
    maxOutputTokens: 1500,
    model: openai(rewriteModelId),
    prompt,
    system,
    temperature: 0.6,
    timeout: rewriteTimeoutMs,
  }
}
