import RewriteForm from '@rewritepal/components/rewrite/rewrite-form'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-4 animate-in fade-in duration-1000">
      <h1 className="sm:text-6xl text-4xl max-w-5xl font-bold text-slate-900 hover:scale-105 transition duration-300 ease-in-out mb-4">
        Ensure your writing is mistake-free and polished
      </h1>
      <p className="sm:text-lg text-base max-w-xl font-light text-slate-900 hover:scale-105 transition duration-300 ease-in-out">
        Instantly generate clear, compelling writing while maintaining your
        unique voice.
      </p>

      <RewriteForm />
    </div>
  )
}
