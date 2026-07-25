'use client'

import { useCompletion } from '@ai-sdk/react'
import {
  NumberFourIcon,
  NumberOneIcon,
  NumberThreeIcon,
  NumberTwoIcon,
} from '@phosphor-icons/react/dist/ssr'
import { topLanguages } from '@rewritepal/lib/constants/languages'
import { CUSTOM_ROLE, rolesList } from '@rewritepal/lib/constants/roles'
import { possibleTones } from '@rewritepal/lib/constants/tones'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Textarea } from '../ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'
import ViewsCounter from '../views-counter'

const stepIconClassName = 'rounded-full bg-primary p-1 text-primary-foreground'

export default function RewriteForm() {
  const [text, setText] = useState('')
  const [tones, setTones] = useState<string[]>([])
  const [role, setRole] = useState('Standard')
  const [customRole, setCustomRole] = useState('')
  const [language, setLanguage] = useState('English')
  const [isRewriting, setIsRewriting] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const resultRef = useRef<HTMLDivElement>(null)

  const loadViewCount = useCallback(async () => {
    try {
      const response = await fetch('/api/views')
      const count: unknown = await response.json()

      if (response.ok && typeof count === 'number') {
        setViewCount(count)
      }
    } catch {
      // The counter is non-critical; the rewrite flow remains available.
    }
  }, [])

  useEffect(() => {
    void loadViewCount()
  }, [loadViewCount])

  const refreshViewCount = useCallback(() => {
    void loadViewCount()
    window.setTimeout(() => void loadViewCount(), 300)
  }, [loadViewCount])

  const { completion, complete } = useCompletion({
    api: '/api/rewriter',
    streamProtocol: 'text',
    onFinish: () => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' })
      refreshViewCount()
    },
    onError: () =>
      toast.error('Unable to rewrite your text. Please try again.'),
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isRewriting) {
      return
    }

    if (!text.trim()) {
      toast.error('Please enter some text to rewrite.')
      return
    }

    if (role === CUSTOM_ROLE && !customRole.trim()) {
      toast.error('Please enter a custom role.')
      return
    }

    setIsRewriting(true)

    try {
      await complete(text, {
        body: { customRole, language, role, tones },
      })
    } catch (error) {
      console.error('An error occurred during rewriting.', error)
    } finally {
      setIsRewriting(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(completion)
      toast.success('Copied to clipboard.')
    } catch {
      toast.error('Unable to copy the rewritten text.')
    }
  }

  function handleToneChange(nextTones: string[]) {
    if (nextTones.length > 3) {
      toast.error('Choose up to three tones.')
      return
    }

    setTones(nextTones)
  }

  return (
    <form
      className="max-w-4xl w-full gap-6 flex flex-col"
      onSubmit={handleSubmit}
    >
      <div className="self-center mt-7 mb-5">
        <ViewsCounter count={viewCount} />
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
          id="text-input"
          name="text"
          placeholder="Type or paste your text here."
          rows={4}
          spellCheck
          className="text-base font-mono"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
        />
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
          <Select value={role} onValueChange={setRole}>
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
            aria-label="Custom role"
            className="md:ml-10 mt-2 w-60"
            maxLength={30}
            placeholder="Enter custom role"
            value={customRole}
            onChange={(event) => setCustomRole(event.target.value)}
          />
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

      <Button
        className="self-center mt-4"
        disabled={isRewriting}
        size="xl"
        type="submit"
        variant="xl"
      >
        {isRewriting ? 'Rewriting…' : 'Rewrite →'}
      </Button>

      <div ref={resultRef} aria-live="polite" className="min-h-0">
        {completion && (
          <section className="mt-5" aria-labelledby="rewritten-text-heading">
            <h2
              id="rewritten-text-heading"
              className="mx-auto mb-4 text-3xl font-bold sm:text-xl"
            >
              Rewritten text
            </h2>
            <button
              type="button"
              className="cursor-copy rounded-xl border bg-card p-4 text-card-foreground shadow-2xl transition hover:bg-accent hover:text-accent-foreground"
              onClick={handleCopy}
            >
              <span className="block mb-2">{completion}</span>
              <span className="text-muted-foreground">Click to copy</span>
            </button>
          </section>
        )}
      </div>
    </form>
  )
}
