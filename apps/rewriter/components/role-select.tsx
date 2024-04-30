import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const rolesList: { role: string; emoji: string }[] = [
  { role: 'Standard', emoji: '' },
  { role: 'Academic', emoji: '🎓' },
  { role: 'Blogger', emoji: '✍️' },
  { role: 'Business Professional', emoji: '💼' },
  { role: 'Comedian', emoji: '🤣' },
  { role: 'Content Creator', emoji: '🖋️' },
  { role: 'Copywriter', emoji: '📝' },
  { role: 'Creative Professional', emoji: '🎨' },
  { role: 'Data Analyst', emoji: '📊' },
  { role: 'Designer', emoji: '🎨' },
  { role: 'Developer', emoji: '💻' },
  { role: 'Educator', emoji: '📚' },
  { role: 'Entrepreneur', emoji: '💡' },
  { role: 'Graphic Designer', emoji: '🎨' },
  { role: 'Journalist', emoji: '📰' },
  { role: 'Marketer', emoji: '📈' },
  { role: 'Project Manager', emoji: '📊' },
  { role: 'Sales Representative', emoji: '🤝' },
  { role: 'SEO Specialist', emoji: '🔍' },
  { role: 'Social Media Manager', emoji: '📱' },
  { role: 'Technical Writer', emoji: '📝' },
  { role: 'Writer', emoji: '✍️' },
  { role: 'Other', emoji: '' },
]

export default function RoleSelect() {
  const [role, setRole] = useState<string | undefined>(undefined)
  const [customRole, setCustomRole] = useState<string>('')
  const [showCustomRoleInput, setShowCustomRoleInput] = useState<boolean>(false)

  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole')
    if (savedRole) {
      const roleExists = rolesList.some((roleItem) => roleItem.role === savedRole)
      if (roleExists) {
        setRole(savedRole)
      } else {
        setRole('Other')
        setCustomRole(savedRole)
        setShowCustomRoleInput(true)
      }
    } else {
      setRole('Standard')
    }
  }, [])

  useEffect(() => {
    if (role === undefined) return
    localStorage.setItem('selectedRole', role)
    if (role === 'Other') {
      setShowCustomRoleInput(true)
    } else {
      setShowCustomRoleInput(false)
    }
  }, [role])

  const handleRoleChange = (newRole: string) => {
    setRole(newRole)
    if (newRole === 'Other') {
      setShowCustomRoleInput(true)
    } else {
      setShowCustomRoleInput(false)
    }
  }

  const handleCustomRoleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.slice(0, 20)
    setCustomRole(inputValue)
    localStorage.setItem('selectedRole', inputValue)
  }

  return (
    <div className='flex flex-col md:flex-row'>
      <Select onValueChange={handleRoleChange} value={role}>
        <SelectTrigger className='w-[200px]'>
          <SelectValue placeholder='Role' />
        </SelectTrigger>
        <SelectContent>
          {rolesList.map((role) => (
            <SelectItem key={role.role} value={role.role}>
              {role.emoji} {role.role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showCustomRoleInput && (
        <Input
          type='text'
          value={customRole}
          onChange={handleCustomRoleInput}
          placeholder='Enter custom role'
          maxLength={20}
          className='md:ml-4 mt-2 md:mt-0'
        />
      )}
    </div>
  )
}
