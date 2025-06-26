import { useViewsStore } from '@rewritepal/stores/views'
import { useEffect } from 'react'

export default function ViewsCounter() {
  const { count, setCount } = useViewsStore()

  useEffect(() => {
    async function fetchViews() {
      const response = await fetch('/api/views')
      const data = await response.json()
      setCount(data)
    }
    fetchViews()
  }, [setCount])

  return (
    <p className='border rounded-2xl py-1 px-4 text-slate-500 text-sm  hover:scale-105 transition duration-300 ease-in-out'>
      <b>{(count || 0).toLocaleString()}</b> phrases improved so far
    </p>
  )
}
