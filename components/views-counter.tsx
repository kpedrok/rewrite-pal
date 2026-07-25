type ViewsCounterProps = {
  count: number
}

export default function ViewsCounter({ count }: ViewsCounterProps) {
  return (
    <p className="rounded-2xl border px-4 py-1 text-sm text-muted-foreground transition duration-300 ease-in-out hover:scale-105">
      <b>{count.toLocaleString()}</b> phrases improved so far
    </p>
  )
}
