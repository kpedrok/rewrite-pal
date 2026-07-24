import { topLanguages } from '@rewritepal/lib/constants/languages'
import { CUSTOM_ROLE, rolesList } from '@rewritepal/lib/constants/roles'
import { possibleTones } from '@rewritepal/lib/constants/tones'
import { z } from 'zod'

const languageValues = topLanguages.map(({ value }) => value) as [
  string,
  ...string[],
]
const roleValues = rolesList
  .map(({ value }) => value)
  .filter((value) => value !== CUSTOM_ROLE) as [string, ...string[]]
const toneValues = possibleTones.map(({ value }) => value) as [
  string,
  ...string[],
]

export const rewriteRequestSchema = z
  .object({
    prompt: z.string().trim().min(1).max(10_000),
    language: z.enum(languageValues).default('English'),
    tones: z.array(z.enum(toneValues)).max(3).default([]),
    role: z.enum([...roleValues, CUSTOM_ROLE]),
    customRole: z.string().trim().max(30).optional(),
  })
  .superRefine(({ customRole, role }, context) => {
    if (role === CUSTOM_ROLE && !customRole) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A custom role is required when Custom is selected.',
        path: ['customRole'],
      })
    }
  })

export type RewriteRequest = z.infer<typeof rewriteRequestSchema>
