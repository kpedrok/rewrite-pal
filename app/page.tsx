'use client'
import DropDown, { VibeType } from '@/components/DropDown'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { NumberOne, NumberTwo } from '@phosphor-icons/react/dist/ssr'
import React, { useState } from 'react'

export default function Home() {
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  const [vibe, setVibe] = useState<VibeType>('Professional')
  const [isGPT, setIsGPT] = useState(true)

  return (
    <div className='flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen '>
      <Header />
      <main className='flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20 animate-in fade-in duration-1000'>
        <h1 className='sm:text-6xl text-4xl max-w-3xl font-bold text-slate-900 hover:scale-105 transition duration-300 ease-in-out mb-4'>
          Ensure your writing is mistake-free and polished
        </h1>
        <h3 className='sm:text-lg text-md max-w-lg font-light text-slate-900 hover:scale-105 transition duration-300 ease-in-out'>
          Instantly generate clear, compelling writing while maintaining your unique voice.
        </h3>
        <p className='border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out  mt-7 '>
          <b>112</b> phrases improved so far
        </p>
        {/* <div className='mt-7'>{<Toggle isGPT={isGPT} setIsGPT={setIsGPT} />}</div> */}

        <div className='max-w-xl w-full'>
          <div className='flex mt-10 items-center space-x-3'>
            <NumberOne
              weight='light'
              size={30}
              color='#ffffff'
              alt='1 icon'
              className='mb-5 sm:mb-0 bg-black rounded-full p-1'
            />

            <p className='text-left font-medium'>
              Paste your text here
              <span className='text-slate-500'> (⌘+V)</span>.
            </p>
          </div>
          <textarea
            // value={bio}
            // onChange={(e) => setBio(e.target.value)}
            ref={inputRef}
            rows={4}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5'
            placeholder={'Type or paste your text here.'}
          />
          <div className='flex mb-5 items-center space-x-3'>
            <NumberTwo
              weight='light'
              size={30}
              color='#ffffff'
              alt='2 icon'
              className='mb-5 sm:mb-0 bg-black rounded-full p-1'
            />{' '}
            <p className='text-left font-medium'>Select your tone.</p>
          </div>
          <div className='block'>{<DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />}</div>

          {/* {!loading && (
            <button
              className='bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full'
              onClick={(e) => generateBio(e)}>
              Generate your bio &rarr;
            </button>
          )}
          {loading && (
            <button
              className='bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full'
              disabled>
              <LoadingDots color='white' style='large' />
            </button>
          )} */}
        </div>
        {/* <Toaster position='top-center' reverseOrder={false} toastOptions={{ duration: 2000 }} /> */}
        <hr className='h-px bg-gray-700 border-1 dark:bg-gray-700' />
        <div className='space-y-10 my-10'>
          {/* {generatedBios && (
            <>
              <div>
                <h2 className='sm:text-4xl text-3xl font-bold text-slate-900 mx-auto' ref={bioRef}>
                  Your generated bios
                </h2>
              </div>
              <div className='space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto'>
                {generatedBios
                  .substring(generatedBios.indexOf('1') + 3)
                  .split(/2\.|3\./)
                  .map((generatedBio) => {
                    return (
                      <div
                        className='bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border'
                        onClick={() => {
                          navigator.clipboard.writeText(generatedBio)
                          toast('Bio copied to clipboard', {
                            icon: '✂️',
                          })
                        }}
                        key={generatedBio}>
                        <p>{generatedBio}</p>
                      </div>
                    )
                  })}
              </div>
            </>
          )} */}
        </div>

        {/* <RadioComponent selectLimit={3} />
          <div>
            <Tab.Group>
              <Tab.List>
                <Tab>Tab 1</Tab>
                <Tab>Tab 2</Tab>
                <Tab>Tab 3</Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>Content 1</Tab.Panel>
                <Tab.Panel>Content 2</Tab.Panel>
                <Tab.Panel>Content 3</Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div> */}

        {/* <div className='text-center'>
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
        placeholder='Type or paste your text here.'
        spellCheck={false}
        className='textarea textarea-bordered text-base min-h-[60px] w-full max-w-2xl resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none  font-mono transition-all duration-300'
      /> */}
      </main>
      <Footer />
    </div>
  )
}
