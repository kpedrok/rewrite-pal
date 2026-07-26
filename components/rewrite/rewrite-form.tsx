'use client'

import { useCompletion } from '@ai-sdk/react'
import {
  NumberFourIcon,
  NumberOneIcon,
  NumberThreeIcon,
  NumberTwoIcon,
} from '@phosphor-icons/react/dist/ssr'
import { Button } from '@rewritepal/components/ui/button'
import { Input } from '@rewritepal/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rewritepal/components/ui/select'
import { Textarea } from '@rewritepal/components/ui/textarea'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@rewritepal/components/ui/toggle-group'
import { topLanguages } from '@rewritepal/lib/constants/languages'
import { CUSTOM_ROLE, rolesList } from '@rewritepal/lib/constants/roles'
import { possibleTones } from '@rewritepal/lib/constants/tones'
import {
  MAX_CUSTOM_ROLE_LENGTH,
  MAX_REWRITE_LENGTH,
  MAX_TONES,
} from '@rewritepal/lib/rewrite/limits'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { RewriteCounter } from './rewrite-counter'
import { RewriteResult } from './rewrite-result'
import { useRewriteCount } from './use-rewrite-count'

const stepIconClassName = 'rounded-full bg-primary p-1 text-primary-foreground'

type RewriteStatus = 'idle' | 'working' | 'complete' | 'stopped'

const rewriteStatusMessages: Record<RewriteStatus, string> = {
  idle: '',
  working: 'Rewriting your text.',
  complete: 'Rewrite complete.',
  stopped: 'Rewrite stopped.',
}

type ValidationErrors = {
  customRole?: string
  text?: string
}

export default function RewriteForm() {
  const [text, setText] = useState('')
  const [tones, setTones] = useState<string[]>([])
  const [role, setRole] = useState('Standard')
  const [customRole, setCustomRole] = useState('')
  const [language, setLanguage] = useState('English')
  const [rewriteStatus, setRewriteStatus] = useState<RewriteStatus>('idle')
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const customRoleInputRef = useRef<HTMLInputElement>(null)
  const resultHeadingRef = useRef<HTMLHeadingElement>(null)
  const textInputRef = useRef<HTMLTextAreaElement>(null)
  const { count: rewriteCount, recordCompletedRewrite } = useRewriteCount()

  const { completion, complete, isLoading, stop } = useCompletion({
    api: '/api/rewriter',
    streamProtocol: 'text',
    onFinish: () => {
      setRewriteStatus('complete')
      recordCompletedRewrite()
    },
    onError: () => {
      setRewriteStatus('idle')
      toast.error('Unable to rewrite your text. Please try again.')
    },
  })

  useEffect(() => {
    if (rewriteStatus !== 'complete' || !completion || isLoading) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const heading = resultHeadingRef.current

      if (!heading) {
        return
      }

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      heading.focus({ preventScroll: true })
      heading.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [completion, isLoading, rewriteStatus])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isLoading) {
      return
    }

    const nextErrors: ValidationErrors = {}

    if (!text.trim()) {
      nextErrors.text = 'Enter some text to rewrite.'
    }

    if (role === CUSTOM_ROLE && !customRole.trim()) {
      nextErrors.customRole = 'Enter a custom role.'
    }

    setValidationErrors(nextErrors)

    if (nextErrors.text || nextErrors.customRole) {
      window.requestAnimationFrame(() => {
        if (nextErrors.text) {
          textInputRef.current?.focus()
          return
        }

        customRoleInputRef.current?.focus()
      })
      return
    }

    setRewriteStatus('working')
    void complete(text, {
      body: { customRole, language, role, tones },
    })
  }

  function handleToneChange(nextTones: string[]) {
    if (nextTones.length > MAX_TONES) {
      toast.error(`Choose up to ${MAX_TONES} tones.`)
      return
    }

    setTones(nextTones)
  }

  function handleStop() {
    stop()
    setRewriteStatus('stopped')
  }

  return (
    <form
      className="max-w-4xl w-full gap-6 flex flex-col"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="self-center mt-7 mb-5">
        <RewriteCounter count={rewriteCount} />
      </div>

      <section aria-labelledby="text-label">
        <div className="mt-10 mb-5 flex items-center gap-3">
          <NumberOneIcon
            aria-hidden="true"
            className={stepIconClassName}
            size={30}
            weight="regular"
          />
          <label id="text-label" htmlFor="text-input" className="font-medium">
            Paste your text here{' '}
            <span className="font-normal text-muted-foreground">(⌘+V)</span>
          </label>
        </div>

        <Textarea
          ref={textInputRef}
          id="text-input"
          aria-describedby={
            validationErrors.text
              ? 'text-character-count text-error'
              : 'text-character-count'
          }
          aria-invalid={Boolean(validationErrors.text)}
          name="text"
          maxLength={MAX_REWRITE_LENGTH}
          placeholder="Type or paste your text here."
          required
          rows={4}
          spellCheck
          className="text-base font-mono"
          value={text}
          onChange={(event) => {
            setText(event.target.value)
            setValidationErrors((current) => ({
              ...current,
              text: undefined,
            }))
          }}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
        />
        <p
          id="text-character-count"
          className="mt-2 text-right text-sm text-muted-foreground"
        >
          {text.length.toLocaleString()} / {MAX_REWRITE_LENGTH.toLocaleString()}{' '}
          characters
        </p>
        {validationErrors.text && (
          <p id="text-error" className="mt-1 text-sm text-destructive">
            {validationErrors.text}
          </p>
        )}
      </section>

      <section aria-labelledby="tones-label">
        <div className="mb-5 flex items-center gap-3">
          <NumberTwoIcon
            aria-hidden="true"
            className={stepIconClassName}
            size={30}
            weight="regular"
          />
          <h2 id="tones-label" className="font-medium">
            Select your tone{' '}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </h2>
        </div>

        <ToggleGroup
          aria-labelledby="tones-label"
          className="flex flex-wrap"
          size="lg"
          type="multiple"
          value={tones}
          variant="outline"
          onValueChange={handleToneChange}
        >
          {possibleTones.map(({ emoji, value }) => (
            <ToggleGroupItem key={value} value={value} aria-label={value}>
              <span className="w-30">
                {emoji} {value}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </section>

      <section aria-labelledby="role-label">
        <div className="flex items-center gap-3">
          <NumberThreeIcon
            aria-hidden="true"
            className={stepIconClassName}
            size={30}
            weight="regular"
          />
          <label id="role-label" htmlFor="role" className="font-medium">
            Role{' '}
            <span className="hidden font-normal text-muted-foreground md:contents">
              (optional)
            </span>
            :
          </label>
          <Select
            value={role}
            onValueChange={(nextRole) => {
              setRole(nextRole)

              if (nextRole !== CUSTOM_ROLE) {
                setValidationErrors((current) => ({
                  ...current,
                  customRole: undefined,
                }))
              }
            }}
          >
            <SelectTrigger id="role" className="w-60">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {rolesList.map(({ emoji, value }) => (
                  <SelectItem key={value} value={value}>
                    {emoji} {value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {role === CUSTOM_ROLE && (
          <Input
            ref={customRoleInputRef}
            id="custom-role"
            aria-describedby={
              validationErrors.customRole ? 'custom-role-error' : undefined
            }
            aria-invalid={Boolean(validationErrors.customRole)}
            aria-label="Custom role"
            className="md:ml-10 mt-2 w-60"
            maxLength={MAX_CUSTOM_ROLE_LENGTH}
            placeholder="Enter custom role"
            required
            value={customRole}
            onChange={(event) => {
              setCustomRole(event.target.value)
              setValidationErrors((current) => ({
                ...current,
                customRole: undefined,
              }))
            }}
          />
        )}
        {role === CUSTOM_ROLE && validationErrors.customRole && (
          <p
            id="custom-role-error"
            className="mt-1 text-sm text-destructive md:ml-10"
          >
            {validationErrors.customRole}
          </p>
        )}
      </section>

      <section aria-labelledby="language-label">
        <div className="flex items-center gap-3">
          <NumberFourIcon
            aria-hidden="true"
            className={stepIconClassName}
            size={30}
            weight="regular"
          />
          <label id="language-label" htmlFor="language" className="font-medium">
            Language:
          </label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language" className="w-50">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {topLanguages.map(({ emoji, value }) => (
                  <SelectItem key={value} value={value}>
                    {emoji} {value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>

      <div className="mt-4 flex items-center justify-center gap-3">
        <Button disabled={isLoading} size="xl" type="submit" variant="xl">
          {isLoading ? 'Rewriting…' : 'Rewrite →'}
        </Button>
        {isLoading && (
          <Button onClick={handleStop} type="button" variant="outline">
            Stop rewriting
          </Button>
        )}
      </div>
      <p className="mx-auto max-w-xl text-sm text-muted-foreground">
        Your text is sent to OpenAI to generate a rewrite. Do not submit
        sensitive information.{' '}
        <Link
          className="font-medium underline underline-offset-2"
          href="/privacy"
        >
          Privacy details
        </Link>
        .
      </p>

      <p className="sr-only" role="status">
        {rewriteStatusMessages[rewriteStatus]}
      </p>

      <RewriteResult
        completion={completion}
        headingRef={resultHeadingRef}
        isStreaming={isLoading}
      />
    </form>
  )
}
