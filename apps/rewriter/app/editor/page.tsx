import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('../../components/editor'), { ssr: false })

export default function App() {
  return (
    <div className='flex flex-col items-center flex-1 px-4 sm:px-5 my-10 gap-5'>
      <h1 className='text-4xl font-bold mb-2'>AI Text Editor</h1>
      <div className='flex-1 w-full h-full shadow-2xl border-1 rounded-md'>
        <Editor />
      </div>
    </div>
  )
}
