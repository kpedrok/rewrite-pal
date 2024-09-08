import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type ViewsStore = {
  count: number
  setCount: (count: ViewsStore['count']) => void
  incrementCount: () => void
}

export const useViewsStore = create(
  persist<ViewsStore>(
    (set, get) => ({
      count: 0,
      incrementCount: () => set({ count: get().count + 1 }),
      setCount: (count) => set(() => ({ count })),
    }),
    {
      name: 'count-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
