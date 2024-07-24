'use client'
import { NumberFour, NumberOne, NumberThree, NumberTwo } from '@phosphor-icons/react/dist/ssr'
import { Button } from '@repo/ui/components/ui/button'

import { ParsedEvent, ReconnectInterval, createParser } from 'eventsource-parser'
import posthog from 'posthog-js'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import TonesToggleGroup from '../components/TonesToggleGroup'
import LanguageSelect from '../components/language-select'
import RoleSelect from '../components/role-select'
import { StorageKey } from '../lib/StorageKey'
import { TrackingEvents } from '../lib/TrackingEvents'
import { scrollToBottom } from '../lib/utils'

const DEFAULT_VIEWS = '--'

export default function Home() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [impersonatorMode, setImpersonatorMode] = useState(false)
  const [views, setViews] = useState(DEFAULT_VIEWS)
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')
  const [generatedText, setGeneratedText] = useState<String>('')
  const resultRef = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    fetchViews()
    focusInput()
  }, [])

  const fetchViews = async () => {
    const response = await fetch('/api/views', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    setViews(data)
  }

  const focusInput = () => {
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      buttonRef.current?.click()
    }
  }

  const rewrite = async (e: any) => {
    e.preventDefault()
    setGeneratedText('')
    setLoading(true)
    setViews(views + 1)

    try {
      scrollToBottom()
      await postToApiOpenai(text)
      await postToApiViews()
    } catch (error) {
      console.error(error)
      toast.error(`${error}`)
      posthog.capture(TrackingEvents.ERROR, {
        message: `${error}`,
      })
    } finally {
      setLoading(false)
      posthog.capture(TrackingEvents.REWRITE, {
        tone: localStorage.getItem(StorageKey.SELECTED_VIBES),
        language: localStorage.getItem(StorageKey.SELECTED_LANGUAGE),
        role: localStorage.getItem(StorageKey.SELECTED_ROLE),
        words: text?.split(' ')?.length,
        $set: { role: localStorage.getItem(StorageKey.SELECTED_ROLE) },
      })
    }
  }

  const postToApiViews = async () => {
    await fetch('/api/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const postToApiOpenai = async (sentence: string) => {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sentence,
        vibe: localStorage.getItem(StorageKey.SELECTED_VIBES),
        language: localStorage.getItem(StorageKey.SELECTED_LANGUAGE),
        role: localStorage.getItem(StorageKey.SELECTED_ROLE),
      }),
    })
    if (!response.ok) {
      const errorData = await response.text()
      const errorMessage = errorData || response.statusText
      throw new Error(errorMessage)
    }

    const data = response.body
    if (!data) {
      return
    }

    const onParseGPT = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === 'event') {
        const data = event.data
        try {
          const text = JSON.parse(data).text ?? ''
          setGeneratedText((prev) => prev + text)
          scrollToResult()
        } catch (e) {
          console.error(e)
        }
      }
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    const parser = createParser(onParseGPT)
    let done = false
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      parser.feed(chunkValue)
    }
  }

  const scrollToResult = () => {
    if (resultRef.current !== null) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(generatedText.toString())
    toast('Copied to clipboard', {
      icon: '✂️',
    })
    posthog.capture(TrackingEvents.REWRITE_COPIED)
  }

  return (
    <div className='flex flex-col items-center justify-center text-center mt-4 animate-in fade-in duration-1000'>
      <h1 className='sm:text-6xl text-4xl max-w-5xl font-bold text-slate-900 hover:scale-105 transition duration-300 ease-in-out mb-4'>
        Ensure your writing is mistake-free and polished
      </h1>
      <h3 className='sm:text-lg text-md max-w-xl font-light text-slate-900 hover:scale-105 transition duration-300 ease-in-out'>
        Instantly generate clear, compelling writing while maintaining your unique voice.
      </h3>
      <p className='border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out  mt-7 '>
        <b>{views?.toLocaleString()}</b> phrases improved so far
      </p>

      {/* <ModeSwitch checked={impersonatorMode} onChecked={setImpersonatorMode}></ModeSwitch> */}

      <div className='max-w-4xl w-full'>
        <div className='flex mt-10 items-center space-x-3'>
          <NumberOne weight='regular' size={30} color='#ffffff' alt='1 icon' className=' bg-black rounded-full p-1' />
          <p className='text-left font-medium'>
            Paste your text here
            <span className='text-slate-500 font-normal'> (⌘+V)</span>
          </p>
        </div>
        <textarea
          id='textInput'
          name='text'
          spellCheck='true'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          rows={4}
          className='text-base font-mono w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5'
          placeholder={'Type or paste your text here.'}
        />
        <div className='flex mb-5 items-center space-x-3'>
          <NumberTwo weight='regular' size={30} color='#ffffff' alt='2 icon' className=' bg-black rounded-full p-1' />{' '}
          <p className='text-left font-medium'>
            Select your tone <span className='text-slate-500 font-normal'> (optional)</span>
          </p>
        </div>

        <TonesToggleGroup></TonesToggleGroup>

        <div className='flex mb-5 mt-6 items-center space-x-3'>
          <NumberThree weight='regular' size={30} color='#ffffff' alt='3 icon' className=' bg-black rounded-full p-1' />{' '}
          <p className='text-left font-medium'>
            Role<span className='text-slate-500 font-normal hidden md:contents'> (optional)</span>:
          </p>
          <RoleSelect />
        </div>

        <div className='flex mb-5 mt-6 items-center space-x-3'>
          <NumberFour weight='regular' size={30} color='#ffffff' alt='3 icon' className=' bg-black rounded-full p-1' />{' '}
          <p className='text-left font-medium'>Language: </p>
          <LanguageSelect />
        </div>

        {!loading && (
          <Button
            ref={buttonRef}
            aria-label='Rewrite text'
            size='xl'
            variant='xl'
            className='sm:mt-10 mt-8'
            onClick={(e) => rewrite(e)}>
            Rewrite &rarr;
          </Button>
        )}

        {loading && (
          <Button size='xl' variant='xl' className='sm:mt-10 mt-8' disabled>
            Loading...
          </Button>
        )}
      </div>
      <hr className='h-px bg-gray-700 border-1 dark:bg-gray-700' />
      <div className='space-mt-10 mt-5'>
        {generatedText && (
          <>
            <div>
              <h2 className='sm:text-xl text-3xl font-bold text-slate-900 mx-auto mb-4'>Rewritten phrase</h2>
            </div>
            <div className='space-y-8 pb-4 flex flex-col items-center justify-center max-w-xl mx-auto'>
              <div
                className='bg-white rounded-xl shadow-2xl p-4 hover:bg-gray-100 transition cursor-copy border shadow-slate-300'
                onClick={handleCopyClick}
                key={generatedText.toString()}>
                <p className='mb-2'>{generatedText.toString()}</p>
                <span ref={resultRef} className='text-gray-400'>
                  (click here to copy)
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
