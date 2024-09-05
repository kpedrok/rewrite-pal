import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type ToneStore = {
  selectedTones: string[]
  setTones: (selectedTones: ToneStore['selectedTones']) => void
}

export const useToneStore = create(
  persist<ToneStore>(
    (set, get) => ({
      selectedTones: [],
      setTones: (selectedTones) => set(() => ({ selectedTones })),
    }),
    {
      name: 'tone-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
