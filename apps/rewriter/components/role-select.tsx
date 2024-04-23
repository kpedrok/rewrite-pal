import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole')
    if (savedRole) {
      setRole(savedRole)
    } else {
      setRole('Standard')
    }
  }, [])

  useEffect(() => {
    if (role === undefined) return
    localStorage.setItem('selectedRole', role)
  }, [role])

  return (
    <Select onValueChange={setRole} value={role}>
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
  )
}
