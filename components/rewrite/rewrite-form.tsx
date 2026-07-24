'use client'

import { useCompletion } from '@ai-sdk/react'
import {
  NumberFour,
  NumberOne,
  NumberThree,
  NumberTwo,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Textarea } from '../ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'
import ViewsCounter from '../views-counter'

const stepIconClassName = 'bg-black rounded-full p-1 text-white'

export default function RewriteForm() {
  const [text, setText] = useState('')
  const [tones, setTones] = useState<string[]>([])
  const [role, setRole] = useState('Standard')
  const [customRole, setCustomRole] = useState('')
  const [language, setLanguage] = useState('English')
  const [isRewriting, setIsRewriting] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const resultRef = useRef<HTMLDivElement>(null)

  const { completion, complete } = useCompletion({
    api: '/api/rewriter',
    streamProtocol: 'text',
    onFinish: () => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' })
      void loadViewCount()
    },
    onError: () =>
      toast.error('Unable to rewrite your text. Please try again.'),
  })

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

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
        <div className="flex mt-10 items-center space-x-3 mb-5">
          <NumberOne
            aria-hidden="true"
            className={stepIconClassName}
            size={30}
            weight="regular"
          />
          <label id="text-label" htmlFor="text-input" className="font-medium">
            Paste your text here{' '}
            <span className="text-slate-500 font-normal">(⌘+V)</span>
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
        <div className="flex mb-5 items-center space-x-3">
          <NumberTwo
            aria-hidden="true"
            className={stepIconClassName}
            size={30}
            weight="regular"
          />
          <h2 id="tones-label" className="font-medium">
            Select your tone{' '}
            <span className="text-slate-500 font-normal">(optional)</span>
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
              <span className="w-[120px]">
                {emoji} {value}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </section>

      <section aria-labelledby="role-label">
        <div className="flex items-center space-x-3">
          <NumberThree
            aria-hidden="true"
            className={stepIconClassName}
            size={30}
            weight="regular"
          />
          <label id="role-label" htmlFor="role" className="font-medium">
            Role{' '}
            <span className="text-slate-500 font-normal hidden md:contents">
              (optional)
            </span>
            :
          </label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role" className="w-[240px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {rolesList.map(({ emoji, value }) => (
                <SelectItem key={value} value={value}>
                  {emoji} {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {role === CUSTOM_ROLE && (
          <Input
            aria-label="Custom role"
            className="md:ml-[42px] mt-2 w-[240px]"
            maxLength={30}
            placeholder="Enter custom role"
            value={customRole}
            onChange={(event) => setCustomRole(event.target.value)}
          />
        )}
      </section>

      <section aria-labelledby="language-label">
        <div className="flex items-center space-x-3">
          <NumberFour
            aria-hidden="true"
            className={stepIconClassName}
            size={30}
            weight="regular"
          />
          <label id="language-label" htmlFor="language" className="font-medium">
            Language:
          </label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language" className="w-[200px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {topLanguages.map(({ emoji, value }) => (
                <SelectItem key={value} value={value}>
                  {emoji} {value}
                </SelectItem>
              ))}
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
              className="sm:text-xl text-3xl font-bold text-slate-900 mx-auto mb-4"
            >
              Rewritten text
            </h2>
            <button
              type="button"
              className="bg-white rounded-xl shadow-2xl p-4 hover:bg-gray-100 transition cursor-copy border shadow-slate-300"
              onClick={handleCopy}
            >
              <span className="block mb-2">{completion}</span>
              <span className="text-gray-400">Click to copy</span>
            </button>
          </section>
        )}
      </div>
    </form>
  )
}
