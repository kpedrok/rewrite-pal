import { ToggleGroup, ToggleGroupItem } from '@repo/ui/components/ui/toggle-group'
import Image from 'next/image'
import { SetStateAction, useEffect, useState } from 'react'
import { StorageKey } from '../lib/StorageKey'

export default function ImpersonatorToggleGroup() {
  const [selectedPerson, setSelectedPerson] = useState<string[] | undefined>(undefined)

  useEffect(() => {
    const storedPersonality = localStorage.getItem(StorageKey.SELECTED_PERSON)
    if (storedPersonality && storedPersonality !== 'undefined' && storedPersonality.length > 0) {
      const parsedPersonality = JSON.parse(storedPersonality)
      const sortedVibes = parsedPersonality.sort()
      setSelectedPerson(sortedVibes)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(StorageKey.SELECTED_PERSON, JSON.stringify(selectedPerson))
  }, [selectedPerson])

  const tones: { value: string; emoji: string }[] = [
    { value: 'William Shakespeare', emoji: '/assets/icons/william-shakespeare.png' },
    { value: 'Steve Jobs', emoji: '/assets/icons/steve-jobs.png' },
    { value: 'Elon Musk', emoji: '/assets/icons/elon-musk.png' },
    { value: 'Coco Chanel', emoji: '/assets/icons/coco-chanel.png' },

    { value: 'Albert Einstein', emoji: '/assets/icons/albert-einstein.png' },
    { value: 'Sigmund Freud', emoji: '/assets/icons/sigmund-freud.png' },
    { value: 'Michael Scott', emoji: '/assets/icons/Michael-Scott.png' },

    { value: 'Tony Stark', emoji: '/assets/icons/iron-man.png' },
    { value: 'Darth Vader', emoji: '/assets/icons/Darth-vader.png' },
    { value: 'Yoda', emoji: '/assets/icons/yoda-yoga.png' },
    { value: 'Gollum / Sméagol', emoji: '/assets/icons/gollum.png' },

    { value: 'Groot', emoji: '/assets/icons/groot.png' },
    { value: 'Chewbacca', emoji: '/assets/icons/Chewbacca.png' },

    { value: 'The Joker', emoji: '/assets/icons/the-joker.png' },
    { value: 'Arya Stark', emoji: '/assets/icons/arya-stark.png' },
  ]

  return (
    <ToggleGroup
      variant='outline'
      size={'lg'}
      type='multiple'
      className='flex flex-wrap'
      value={selectedPerson}
      onValueChange={(value: SetStateAction<string[] | undefined>) => {
        if (value) setSelectedPerson(value)
      }}>
      {tones.map((tone) => (
        <ToggleGroupItem key={tone.value} value={tone.value} aria-label={`Toggle ${tone.value}`}>
          <div className='w-[140px] flex justify-center items-center gap-2'>
            <Image src={tone.emoji} height={36} width={36} alt='Your Name' />
            <span className='truncate'>{tone.value}</span>
          </div>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
