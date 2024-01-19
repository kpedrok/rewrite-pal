'use client'
import React from 'react'
import Textarea from 'react-textarea-autosize'

export default function Home() {
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24 gap-5'>
      <div className='text-center'>
        <h1 className=' text-gray-600 mb-2 duration-1200 ease-in-out animate-in fade-in slide-in-from-top-4'>
          Write your text and let me check your grammar
        </h1>
        <p className='text-slate-400'>1,836,519 phrases improved!</p>
      </div>

      <Textarea
        // value={input}
        // onChange={e => setInput(e.target.value)}
        // onKeyDown={onKeyDown}
        ref={inputRef}
        tabIndex={0}
        rows={1}
        placeholder='Send a message.'
        spellCheck={false}
        className='textarea textarea-bordered min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm font-mono transition-all duration-300'
      />
    </main>
  )
}
