'use client'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import LanguageSelect from '@/components/LanguageSelect'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { sendGAEvent } from '@next/third-parties/google'
import { NumberOne, NumberThree, NumberTwo } from '@phosphor-icons/react/dist/ssr'
import { ParsedEvent, ReconnectInterval, createParser } from 'eventsource-parser'
import posthog from 'posthog-js'
import { useEffect, useRef, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'

const DEFAULT_VIEWS = '--'

export default function Home() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isGPT, setIsGPT] = useState(true)
  const [views, setViews] = useState(DEFAULT_VIEWS)
  const [loading, setLoading] = useState(false)
  const [bio, setBio] = useState('')
  const [generatedBios, setGeneratedBios] = useState<String>('')
  const bioRef = useRef<null | HTMLDivElement>(null)

  const [selectedVibes, setSelectedVibes] = useState<string[] | undefined>(undefined)

  useEffect(() => {
    const storedVibes = localStorage.getItem('selectedVibes')
    if (storedVibes && storedVibes !== 'undefined' && storedVibes.length > 0) {
      setSelectedVibes(JSON.parse(storedVibes))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('selectedVibes', JSON.stringify(selectedVibes))
  }, [selectedVibes])

  const vibes: string[] = [
    '😊 Casual',
    '💼 Professional',
    '📣 Direct',

    '👫 Friendly',
    '🤝 Empathetic',
    '🕊️ Diplomatic',
    '🛠️ Constructive',

    '💪 Confident',
    '🎯 Assertive',
    '🗣️ Persuasive',
    '🌟 Inspirational',

    '📝 Detailed',
    '🎓 Instructive',

    '🔍 Simplify it',
    '📏 Shorten it',
  ]

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
    setGeneratedBios('')
    setLoading(true)
    setViews(views + 1)

    try {
      await postToApiOpenai(bio)
      scrollToBios()
      await postToApiViews()
    } catch (error) {
      console.error(error)
      toast('An error occurred while editing your phrase', {
        icon: '❌',
      })
    } finally {
      setLoading(false)
    }
    posthog.capture('rewrite', { property: 'test' })
    sendGAEvent({ event: 'purchase', value: 'test' })
  }

  const postToApiViews = async () => {
    await fetch('/api/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const postToApiOpenai = async (bio: string) => {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bio,
        vibe: selectedVibes,
        language: localStorage.getItem('selectedLanguage'),
      }),
    })

    if (!response.ok) {
      throw new Error(response.statusText)
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
          setGeneratedBios((prev) => prev + text)
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

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className='flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Header />
      <main className='flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 animate-in fade-in duration-1000'>
        <h1 className='sm:text-6xl text-4xl max-w-5xl font-bold text-slate-900 hover:scale-105 transition duration-300 ease-in-out mb-4'>
          Ensure your writing is mistake-free and polished
        </h1>
        <h3 className='sm:text-lg text-md max-w-xl font-light text-slate-900 hover:scale-105 transition duration-300 ease-in-out'>
          Instantly generate clear, compelling writing while maintaining your unique voice.
        </h3>
        <p className='border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out  mt-7 '>
          <b>{views.toLocaleString()}</b> phrases improved so far
        </p>
        {/* <div className='mt-7'>{<Toggle isGPT={isGPT} setIsGPT={setIsGPT} />}</div> */}
        <div className='max-w-4xl w-full'>
          <div className='flex mt-10 items-center space-x-3'>
            <NumberOne weight='regular' size={30} color='#ffffff' alt='1 icon' className=' bg-black rounded-full p-1' />
            <p className='text-left font-medium'>
              Paste your text here
              <span className='text-slate-500'> (⌘+V)</span>.
            </p>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            rows={4}
            className='text-base font-mono w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5'
            placeholder={'Type or paste your text here.'}
          />
          <div className='flex mb-5 items-center space-x-3'>
            <NumberTwo weight='regular' size={30} color='#ffffff' alt='2 icon' className=' bg-black rounded-full p-1' />{' '}
            <p className='text-left font-medium'>Select your tone.</p>
          </div>

          <ToggleGroup
            variant='outline'
            size={'lg'}
            type='multiple'
            className='flex flex-wrap'
            value={selectedVibes}
            onValueChange={(value) => {
              if (value) setSelectedVibes(value)
            }}>
            {vibes.map((vibe) => (
              <ToggleGroupItem key={vibe} value={vibe} aria-label={`Toggle ${vibe}`}>
                <div className='w-[120px]'>{vibe}</div>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className='flex mb-5 mt-6 items-center space-x-3'>
            <NumberThree
              weight='regular'
              size={30}
              color='#ffffff'
              alt='3 icon'
              className=' bg-black rounded-full p-1'
            />{' '}
            <p className='text-left font-medium'>Language: </p>
            <LanguageSelect />
          </div>
          {!loading && (
            <button
              ref={buttonRef}
              className='bg-black rounded-xl text-white font-medium px-6 py-4 sm:mt-10 mt-8 hover:bg-black/80 w-1/2'
              onClick={(e) => rewrite(e)}>
              Rewrite &rarr;
            </button>
          )}

          {loading && (
            <button
              className='bg-black rounded-xl text-white font-medium px-6 py-4 sm:mt-10 mt-8 hover:bg-black/80 w-1/2'
              disabled>
              Loading...
            </button>
          )}
        </div>
        <Toaster position='top-center' reverseOrder={false} toastOptions={{ duration: 2000 }} />
        <hr className='h-px bg-gray-700 border-1 dark:bg-gray-700' />
        <div className='space-mt-10 mt-10'>
          {generatedBios && (
            <>
              <div>
                <h2 className='sm:text-xl text-3xl font-bold text-slate-900 mx-auto mb-4'>Rewritten phrase</h2>
              </div>
              <div className='space-y-8 pb-4 flex flex-col items-center justify-center max-w-xl mx-auto'>
                <div
                  className='bg-white rounded-xl shadow-2xl p-4 hover:bg-gray-100 transition cursor-copy border shadow-slate-300'
                  onClick={() => {
                    navigator.clipboard.writeText(generatedBios.toString())
                    toast('Copied to clipboard', {
                      icon: '✂️',
                    })
                  }}
                  key={generatedBios.toString()}>
                  <p className='mb-2' ref={bioRef}>
                    {generatedBios.toString()}
                  </p>
                  <span className='text-gray-400'> (click here to copy)</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
