import { RewritePalLogo } from '@repo/ui/components/rewritepal/logo'
import { kv } from '@vercel/kv'
import { Metadata } from 'next'
import Link from 'next/link'
import { saveEmail } from './actions'
import FeatureForm from './form'
import { Feature } from './types'

export let metadata: Metadata = {
  title: {
    default: 'RewritePal | Write Better, Communicate Better, Deliver More',
    template: '%s | RewritePal',
  },
  description: `Your Free AI Writing Tool. Paraphrasing tool, improve any paragraph's readability and rewrite it to make it sound more human-like with this powerful free tool.`,
  keywords: [
    'paraphrasing',
    'rewrite',
    'grammar checker',
    'AI writing assistant',
    'proofreading tool',
    'writing tool',
    'grammar tool',
    'free writing assistant',
    'language improvement',
    'online editor',
    'spelling check',
    'punctuation checker',
  ],
  robots: 'index, follow',
}

async function getFeatures() {
  try {
    let itemIds = await kv.zrange('items_by_score', 0, 100, {
      rev: true,
    })

    if (!itemIds.length) {
      return []
    }

    let multi = kv.multi()
    itemIds.forEach((id) => {
      multi.hgetall(`item:${id}`)
    })

    let items: Feature[] = await multi.exec()
    return items.map((item) => {
      return {
        ...item,
        score: item.score,
        created_at: item.created_at,
      }
    })
  } catch (error) {
    console.error(error)
    return []
  }
}

export default async function Page() {
  let features = await getFeatures()

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <main className='flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center'>
        <div className='flex justify-center items-center bg-black rounded-full w-16 sm:w-24 h-16 sm:h-24 my-8'>
          <Link href='https://www.rewritepal.com'>
            <RewritePalLogo className='h-10 sm:h-16 invert ' />
          </Link>
        </div>
        <h1 className='text-lg sm:text-5xl font-bold mb-2'>Let's build it together</h1>
        <h2 className='text-md sm:text-xl mx-4'>Create or vote up features you want to see in this product.</h2>
        <div className='flex flex-wrap items-center justify-around max-w-4xl my-8 sm:w-full bg-white rounded-md shadow-xl h-full border border-gray-100'>
          <FeatureForm features={features} />
          <hr className='border-1 border-gray-200 my-8 mx-8 w-full' />
          <div className='mx-8 w-full'>
            <p className='flex text-gray-500'>
              Leave your email address here to be notified when feature requests are released.
            </p>
            <form className='relative my-4' action={saveEmail}>
              <input
                name='email'
                aria-label='Email for updates'
                placeholder='Email Address'
                type='email'
                autoComplete='email'
                maxLength={60}
                required
                className='px-3 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300'
              />
              <button
                className='flex items-center justify-center absolute right-2 top-2 px-4 h-10 border border-gray-200 text-gray-900 rounded-md w-14 focus:outline-none focus:ring focus:ring-blue-300 focus:bg-gray-100'
                type='submit'>
                OK
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
