type RewriteCounterProps = {
  count: number | null
}

export function RewriteCounter({ count }: RewriteCounterProps) {
  if (count === null) {
    return (
      <p className="rounded-2xl border px-4 py-1 text-sm text-muted-foreground">
        Loading completed rewrite count…
      </p>
    )
  }

  return (
    <p className="rounded-2xl border px-4 py-1 text-sm text-muted-foreground motion-safe:transition motion-safe:duration-300 motion-safe:ease-in-out motion-safe:hover:scale-105">
      <b>{count.toLocaleString()}</b> phrases improved so far
    </p>
  )
}
