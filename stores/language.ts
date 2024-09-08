import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type LanguageStore = {
  selectedLanguage: string
  setLanguage: (selectedLanguage: LanguageStore['selectedLanguage']) => void
}

export const useLanguageStore = create(
  persist<LanguageStore>(
    (set, get) => ({
      selectedLanguage: 'English',
      setLanguage: (selectedLanguage) => set(() => ({ selectedLanguage })),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
