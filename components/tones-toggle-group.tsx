import { possibleTones } from '@rewritepal/lib/constants/tones'
import { ListItem } from '@rewritepal/lib/interfaces/items'
import { useToneStore } from '@rewritepal/stores/tones'
import { SetStateAction, useCallback } from 'react'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'

export default function TonesToggleGroup() {
  const { selectedTones, setTones } = useToneStore()

  const handleValueChange = useCallback(
    (value: SetStateAction<string[]>) => {
      if (Array.isArray(value)) {
        setTones(value)
      }
    },
    [setTones]
  )

  const renderToneItem = ({ value, emoji }: ListItem) => (
    <ToggleGroupItem key={value} value={value} aria-label={`Toggle ${value}`}>
      <div className='w-[120px]'>
        {emoji} {value}
      </div>
    </ToggleGroupItem>
  )

  return (
    <ToggleGroup
      variant='outline'
      size='lg'
      type='multiple'
      className='flex flex-wrap'
      value={selectedTones}
      onValueChange={handleValueChange}>
      {possibleTones.map(renderToneItem)}
    </ToggleGroup>
  )
}
