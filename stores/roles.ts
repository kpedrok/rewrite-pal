import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type RoleStore = {
  selectedRole: string
  setRole: (selectedRole: RoleStore['selectedRole']) => void

  customRole: string
  setCustomRole: (custom: RoleStore['customRole']) => void
}

export const useRoleStore = create(
  persist<RoleStore>(
    (set, get) => ({
      selectedRole: 'Standard',
      setRole: (selectedRole) => set(() => ({ selectedRole })),
      customRole: '',
      setCustomRole: (customRole) => set(() => ({ customRole })),
    }),
    {
      name: 'role-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
