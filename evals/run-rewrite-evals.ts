import { openai } from '@ai-sdk/openai'
import { rewriteEvalCases } from '@rewritepal/evals/rewrite-cases'
import {
  createJudgePrompt,
  type DeterministicCheck,
  getJudgeScore,
  hasCriticalJudgeFailure,
  type RewriteJudgment,
  rewriteJudgeSchema,
  rewriteJudgeSystemPrompt,
  runDeterministicChecks,
} from '@rewritepal/evals/rewrite-rubric'
import { buildRewriteSystemPrompt } from '@rewritepal/lib/rewrite/prompt'
import { rewriteRequestSchema } from '@rewritepal/lib/rewrite/schema'
import { getOpenAIEnv } from '@rewritepal/lib/server/env'
import {
  createRewriteGenerationOptions,
  rewriteModelId,
} from '@rewritepal/lib/server/rewrite-generation'
import { generateText, Output } from 'ai'

type EvalCaseResult = {
  caseId: string
  deterministicChecks: DeterministicCheck[]
  error?: string
  generation?: {
    finishReason: string
    latencyMs: number
    modelId?: string
    usage: {
      inputTokens?: number
      outputTokens?: number
      totalTokens?: number
    }
  }
  judge?: {
    finishReason: string
    latencyMs: number
    modelId?: string
    usage: {
      inputTokens?: number
      outputTokens?: number
      totalTokens?: number
    }
  }
  judgeScore?: number
  judgment?: RewriteJudgment
  output?: string
  tags: string[]
}

const strictMode = Bun.argv.includes('--strict')
const judgeModelId = rewriteModelId

async function getRevision(): Promise<string> {
  if (process.env.GITHUB_SHA) {
    return process.env.GITHUB_SHA.slice(0, 7)
  }

  const result = await Bun.$`git rev-parse --short HEAD`.nothrow().quiet()
  return result.exitCode === 0 ? result.text().trim() : 'unknown'
}

async function runEvalCase(index: number): Promise<EvalCaseResult> {
  const evalCase = rewriteEvalCases[index]

  if (!evalCase) {
    throw new Error(`Missing eval case at index ${index}.`)
  }

  const request = rewriteRequestSchema.parse(evalCase.request)
  const generationStartedAt = performance.now()

  try {
    const generation = await generateText(
      createRewriteGenerationOptions({
        prompt: request.prompt,
        system: buildRewriteSystemPrompt(request),
      }),
    )
    const generationMetadata = {
      finishReason: generation.finishReason,
      latencyMs: Math.round(performance.now() - generationStartedAt),
      modelId: generation.response.modelId,
      usage: generation.usage,
    }
    const deterministicChecks = runDeterministicChecks(
      evalCase,
      generation.text,
    )
    const judgeStartedAt = performance.now()

    try {
      const judge = await generateText({
        maxOutputTokens: 500,
        model: openai(judgeModelId),
        output: Output.object({
          description: 'A rubric score for a RewritePal rewrite.',
          name: 'rewrite_evaluation',
          schema: rewriteJudgeSchema,
        }),
        prompt: createJudgePrompt(evalCase, generation.text),
        system: rewriteJudgeSystemPrompt,
        temperature: 0,
      })

      return {
        caseId: evalCase.id,
        deterministicChecks,
        generation: generationMetadata,
        judge: {
          finishReason: judge.finishReason,
          latencyMs: Math.round(performance.now() - judgeStartedAt),
          modelId: judge.response.modelId,
          usage: judge.usage,
        },
        judgeScore: getJudgeScore(judge.output),
        judgment: judge.output,
        output: generation.text,
        tags: evalCase.tags,
      }
    } catch (error) {
      return {
        caseId: evalCase.id,
        deterministicChecks,
        error: `Judge failed: ${error instanceof Error ? error.message : 'Unknown eval failure.'}`,
        generation: generationMetadata,
        output: generation.text,
        tags: evalCase.tags,
      }
    }
  } catch (error) {
    return {
      caseId: evalCase.id,
      deterministicChecks: [],
      error: error instanceof Error ? error.message : 'Unknown eval failure.',
      tags: evalCase.tags,
    }
  }
}

function isQualityFailure(result: EvalCaseResult): boolean {
  return (
    result.deterministicChecks.some((check) => !check.passed) ||
    (result.judgeScore !== undefined && result.judgeScore < 3) ||
    (result.judgment !== undefined &&
      hasCriticalJudgeFailure(result.tags, result.judgment))
  )
}

getOpenAIEnv()

const results: EvalCaseResult[] = []

for (let index = 0; index < rewriteEvalCases.length; index += 1) {
  results.push(await runEvalCase(index))
}
const revision = await getRevision()
const report = {
  generatedAt: new Date().toISOString(),
  judgeModelId,
  modelId: rewriteModelId,
  results,
  revision,
  summary: {
    caseCount: results.length,
    infrastructureFailures: results.filter((result) => result.error).length,
    qualityFailures: results.filter(isQualityFailure).length,
  },
}
const reportPath = `eval-results/rewrite-${Date.now()}.json`

await Bun.write(reportPath, `${JSON.stringify(report, null, 2)}\n`)

console.log(`Rewrite eval report: ${reportPath}`)
console.log(
  `Cases: ${report.summary.caseCount}; infrastructure failures: ${report.summary.infrastructureFailures}; quality failures: ${report.summary.qualityFailures}`,
)

for (const result of results) {
  const status = result.error
    ? 'ERROR'
    : isQualityFailure(result)
      ? 'REVIEW'
      : 'PASS'
  console.log(
    `${status} ${result.caseId}${result.judgeScore ? ` (${result.judgeScore.toFixed(2)}/5)` : ''}`,
  )
}

if (
  report.summary.infrastructureFailures > 0 ||
  (strictMode && report.summary.qualityFailures > 0)
) {
  process.exitCode = 1
}
