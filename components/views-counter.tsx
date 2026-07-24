type ViewsCounterProps = {
  count: number
}

export default function ViewsCounter({ count }: ViewsCounterProps) {
  return (
    <p className="border rounded-2xl py-1 px-4 text-slate-500 text-sm  hover:scale-105 transition duration-300 ease-in-out">
      <b>{count.toLocaleString()}</b> phrases improved so far
    </p>
  )
}
