import { CUSTOM_ROLE } from '@rewritepal/lib/constants/roles'
import { useLanguageStore } from '@rewritepal/stores/language'
import { useRoleStore } from '@rewritepal/stores/roles'
import { useToneStore } from '@rewritepal/stores/tones'
import { useViewsStore } from '@rewritepal/stores/views'
import { useCompletion } from 'ai/react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from './ui/button'

export default function ChatResponse({ text, setTriggerFunction }: { text: string; setTriggerFunction: Function }) {
  const resultRef = useRef<null | HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const { incrementCount } = useViewsStore()
  const { selectedTones } = useToneStore()
  const { selectedRole, customRole } = useRoleStore()
  const { selectedLanguage } = useLanguageStore()

  const { completion, complete } = useCompletion({
    api: '/api/rewriter',
    onResponse: () => scrollToResult(),
    onFinish: () => {
      scrollToResult()
      setLoading(false)
    },
    onError: (error) => {
      toast.error(error.message)
      setLoading(false)
    },
  })

  useEffect(() => {
    setTriggerFunction(async () => {
      await rewrite()
    })
  })

  const postToApiViews = async () => {
    await fetch('/api/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(completion.toString())
    toast('Copied to clipboard', {
      icon: '✂️',
    })
    toast.success('Copied to clipboard', {
      icon: '✂️',
    })
    // posthog.capture(TrackingEvents.REWRITE_COPIED)
  }

  const scrollToResult = () => {
    resultRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const rewrite = async () => {
    setLoading(true)
    const body = {
      sentence: text,
      tone: selectedTones.join(', '),
      language: selectedLanguage,
      role: selectedRole === CUSTOM_ROLE ? customRole : selectedRole,
    }
    await complete(text, { body })
    await postToApiViews()
    incrementCount()
  }

  return (
    <div className='flex flex-col gap-6 w-full mt-10 items-center'>
      <Button aria-label='Rewrite text' size='xl' variant='xl' onClick={rewrite} disabled={loading}>
        {loading ? 'Loading...' : 'Rewrite →'}
      </Button>

      {completion && (
        <div className='space-mt-10 mt-5'>
          <div>
            <h2 className='sm:text-xl text-3xl font-bold text-slate-900 mx-auto mb-4'>Rewritten phrase</h2>
          </div>
          <div className='space-y-8 pb-4 flex flex-col items-center justify-center max-w-xl mx-auto'>
            <div
              className='bg-white rounded-xl shadow-2xl p-4 hover:bg-gray-100 transition cursor-copy border shadow-slate-300'
              onClick={handleCopyClick}>
              <p className='mb-2'>{completion.toString()}</p>
              <span className='text-gray-400' ref={resultRef}>
                (click here to copy)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
