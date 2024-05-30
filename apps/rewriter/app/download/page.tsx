'use client'
import { Button } from '@repo/ui/components/ui/button'
import { Input } from '@repo/ui/components/ui/input'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { saveEmail } from '../actions'

export default function DownloadPage() {
  function Product() {
    const searchParams = useSearchParams()
    let product = searchParams.get('product')
    if (product === 'desktop') {
      product = 'Desktop App'
    } else {
      product = 'Browser Extension'
    }
    return product
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <main className='flex flex-col items-center flex-1 px-4 sm:px-20 text-center mt-10 gap-5'>
        <h1 className='text-5xl font-bold mb-2'>
          <Suspense fallback={'Desktop App'}>
            <Product />
          </Suspense>
        </h1>

        <h2 className='text-md sm:text-xl mx-4'>
          Leave your email address here to be notified when our desktop version is released.
        </h2>

        <div className='flex flex-col shadow-2xl border-1 rounded-md m-2 p-4 md:p-10 gap-4'>
          <p className=' text-gray-500'>
            No spam, I promise! The only email you'll get from this list is when this feature goes live.
          </p>
          <form className='flex flex-col gap-2' action={saveEmail}>
            <Input
              name='email'
              aria-label='Email for updates'
              placeholder='Email Address'
              type='email'
              autoComplete='email'
              maxLength={60}
              required></Input>
            <Button type='submit'>Submit</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
