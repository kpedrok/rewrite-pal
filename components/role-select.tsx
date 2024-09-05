import { rolesList } from '@rewritepal/lib/constants/roles'
import { ListItem } from '@rewritepal/lib/interfaces/items'
import { useRoleStore } from '@rewritepal/stores/roles'
import { useCallback } from 'react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export default function RoleSelect() {
  const { selectedRole, setRole, customRole, setCustomRole } = useRoleStore()
  const showCustomRoleInput = selectedRole === 'Custom'

  const handleCustomRoleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value.slice(0, 30)
      setCustomRole(inputValue)
    },
    [setCustomRole]
  )

  const renderSelectItem = ({ value, emoji }: ListItem) => (
    <SelectItem key={value} value={value} aria-label={value}>
      {emoji} {value}
    </SelectItem>
  )

  return (
    <div className='flex flex-col md:flex-row'>
      <Select onValueChange={setRole} value={selectedRole}>
        <SelectTrigger className='w-[240px]'>
          <SelectValue placeholder='Role' />
        </SelectTrigger>
        <SelectContent>{rolesList.map(renderSelectItem)}</SelectContent>
      </Select>

      {showCustomRoleInput && (
        <Input
          type='text'
          value={customRole}
          onChange={handleCustomRoleInput}
          placeholder='Enter custom role'
          maxLength={30}
          className='md:ml-4 mt-2 md:mt-0 w-[240px]'
        />
      )}
    </div>
  )
}
