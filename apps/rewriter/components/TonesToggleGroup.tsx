import { ToggleGroup, ToggleGroupItem } from '@repo/ui/components/ui/toggle-group'
import { SetStateAction, useEffect, useState } from 'react'
import { StorageKey } from '../lib/StorageKey'

export default function TonesToggleGroup() {
  const [selectedVibes, setSelectedVibes] = useState<string[] | undefined>(undefined)

  useEffect(() => {
    const storedVibes = localStorage.getItem(StorageKey.SELECTED_VIBES)
    if (storedVibes && storedVibes !== 'undefined' && storedVibes.length > 0) {
      const parsedVibes = JSON.parse(storedVibes)
      const sortedVibes = parsedVibes.sort()
      setSelectedVibes(sortedVibes)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(StorageKey.SELECTED_VIBES, JSON.stringify(selectedVibes))
  }, [selectedVibes])

  const tones: { value: string; emoji: string }[] = [
    { value: 'Casual', emoji: '😊' },
    { value: 'Professional', emoji: '💼' },
    { value: 'Direct', emoji: '📣' },

    { value: 'Friendly', emoji: '👫' },
    { value: 'Empathetic', emoji: '🤝' },
    { value: 'Diplomatic', emoji: '🕊️' },
    { value: 'Constructive', emoji: '🛠️' },

    { value: 'Confident', emoji: '💪' },
    { value: 'Assertive', emoji: '🎯' },
    { value: 'Persuasive', emoji: '🗣️' },
    { value: 'Inspirational', emoji: '🌟' },

    { value: 'Detailed', emoji: '📝' },
    { value: 'Instructive', emoji: '🎓' },

    { value: 'Simplify it', emoji: '🔍' },
    { value: 'Shorten it', emoji: '📏' },
  ]

  return (
    <ToggleGroup
      variant='outline'
      size={'lg'}
      type='multiple'
      className='flex flex-wrap'
      value={selectedVibes}
      onValueChange={(value: SetStateAction<string[] | undefined>) => {
        if (value) setSelectedVibes(value)
      }}>
      {tones.map((tone) => (
        <ToggleGroupItem key={tone.value} value={tone.value} aria-label={`Toggle ${tone.value}`}>
          <div className='w-[120px]'>
            {tone.emoji} {tone.value}
          </div>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
