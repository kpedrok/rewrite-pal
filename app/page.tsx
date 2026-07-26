import RewriteForm from '@rewritepal/components/rewrite/rewrite-form'

export default function Home() {
  return (
    <div className="mt-4 flex flex-col items-center justify-center text-center motion-safe:animate-in motion-safe:duration-1000 motion-safe:fade-in">
      <h1 className="mb-4 max-w-5xl text-4xl font-bold motion-safe:transition motion-safe:duration-300 motion-safe:ease-in-out motion-safe:hover:scale-105 sm:text-6xl">
        Ensure your writing is mistake-free and polished
      </h1>
      <p className="max-w-xl text-base font-light motion-safe:transition motion-safe:duration-300 motion-safe:ease-in-out motion-safe:hover:scale-105 sm:text-lg">
        Instantly generate clear, compelling writing while maintaining your
        unique voice.
      </p>

      <RewriteForm />
    </div>
  )
}
