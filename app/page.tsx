'use client'
import { NumberFour, NumberOne, NumberThree, NumberTwo } from '@phosphor-icons/react/dist/ssr'
import ChatResponse from '@rewritepal/components/chat-response'
import LanguageSelect from '@rewritepal/components/language-select'
import RoleSelect from '@rewritepal/components/role-select'
import TonesToggleGroup from '@rewritepal/components/tones-toggle-group'
import { Textarea } from '@rewritepal/components/ui/textarea'
import ViewsCounter from '@rewritepal/components/views-counter'
import { ChangeEvent, KeyboardEvent, useState } from 'react'

export default function Home() {
  const [text, setText] = useState('')

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const handleRewrite = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      triggerChildFunction()
    }
  }
  let triggerChildFunction = () => {}

  return (
    <div className='flex flex-col items-center justify-center text-center mt-4 animate-in fade-in duration-1000'>
      <h1 className='sm:text-6xl text-4xl max-w-5xl font-bold text-slate-900 hover:scale-105 transition duration-300 ease-in-out mb-4'>
        Ensure your writing is mistake-free and polished
      </h1>
      <h3 className='sm:text-lg text-md max-w-xl font-light text-slate-900 hover:scale-105 transition duration-300 ease-in-out'>
        Instantly generate clear, compelling writing while maintaining your unique voice.
      </h3>

      <div className='mt-7 mb-5'>
        <ViewsCounter />
      </div>

      <div className='max-w-4xl w-full gap-6 flex flex-col'>
        <section>
          <div className='flex mt-10 items-center space-x-3 mb-5'>
            <NumberOne weight='regular' size={30} color='#ffffff' alt='1 icon' className=' bg-black rounded-full p-1' />
            <p className='text-left font-medium'>
              Paste your text here
              <span className='text-slate-500 font-normal'> (⌘+V)</span>
            </p>
          </div>

          <Textarea
            placeholder={'Type or paste your text here.'}
            rows={4}
            spellCheck='true'
            className='text-base font-mono'
            id='textInput'
            name='text'
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleRewrite}></Textarea>
        </section>

        <section>
          <div className='flex mb-5 items-center space-x-3'>
            <NumberTwo weight='regular' size={30} color='#ffffff' alt='2 icon' className=' bg-black rounded-full p-1' />{' '}
            <p className='text-left font-medium'>
              Select your tone <span className='text-slate-500 font-normal'> (optional)</span>
            </p>
          </div>

          <TonesToggleGroup />
        </section>

        <section>
          <div className='flex items-center space-x-3'>
            <NumberThree
              weight='regular'
              size={30}
              color='#ffffff'
              alt='3 icon'
              className=' bg-black rounded-full p-1'
            />{' '}
            <p className='text-left font-medium'>
              Role<span className='text-slate-500 font-normal hidden md:contents'> (optional)</span>:
            </p>
            <RoleSelect />
          </div>
        </section>

        <section>
          <div className='flex  items-center space-x-3'>
            <NumberFour
              weight='regular'
              size={30}
              color='#ffffff'
              alt='3 icon'
              className=' bg-black rounded-full p-1'
            />{' '}
            <p className='text-left font-medium'>Language: </p>
            <LanguageSelect />
          </div>
        </section>
      </div>
      <hr className='h-px bg-gray-700 border-1 dark:bg-gray-700' />
      <ChatResponse setTriggerFunction={(fn: () => void) => (triggerChildFunction = fn)} text={text} />
    </div>
  )
}
