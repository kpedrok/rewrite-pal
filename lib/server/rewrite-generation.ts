import { openai } from '@ai-sdk/openai'

export const rewriteModelId = 'gpt-4o-mini'

export type RewriteGenerationInput = {
  prompt: string
  system: string
}

export function createRewriteGenerationOptions({
  prompt,
  system,
}: RewriteGenerationInput) {
  return {
    maxOutputTokens: 1500,
    model: openai(rewriteModelId),
    prompt,
    system,
    temperature: 0.6,
  }
}
