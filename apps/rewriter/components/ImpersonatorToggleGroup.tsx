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

  const personalities: { value: string; emoji: string }[] = [
    // Real Personalities
    { value: 'Agatha Christie', emoji: '/assets/icons/agatha-christie.png' },
    { value: 'Albert Einstein', emoji: '/assets/icons/albert-einstein.png' },
    { value: 'Cleopatra', emoji: '/assets/icons/cleopatra.png' },
    { value: 'Coco Chanel', emoji: '/assets/icons/coco-chanel.png' },
    { value: 'Elon Musk', emoji: '/assets/icons/elon-musk.png' },
    { value: 'Jane Austen', emoji: '/assets/icons/jane-austen.png' },
    { value: 'Jesus Christ', emoji: '/assets/icons/jesus.png' },
    { value: 'Marie Curie', emoji: '/assets/icons/marie-curie.png' },
    { value: 'Mother Teresa', emoji: '/assets/icons/mother-teresa.png' },
    { value: 'Sigmund Freud', emoji: '/assets/icons/sigmund-freud.png' },
    { value: 'Stephen Hawking', emoji: '/assets/icons/stephen-hawking.png' },
    { value: 'Steve Jobs', emoji: '/assets/icons/steve-jobs.png' },
    { value: 'William Shakespeare', emoji: '/assets/icons/william-shakespeare.png' },

    // Fictional Personalities
    { value: 'Arya Stark', emoji: '/assets/icons/arya-stark.png' },
    { value: 'Chewbacca', emoji: '/assets/icons/chewbacca.png' },
    { value: 'Darth Vader', emoji: '/assets/icons/darth-vader.png' },
    { value: 'Gollum / Sméagol', emoji: '/assets/icons/gollum.png' },
    { value: 'Groot', emoji: '/assets/icons/groot.png' },
    { value: 'Jack Sparrow', emoji: '/assets/icons/jack-sparrow.png' },
    { value: 'Michael Scott', emoji: '/assets/icons/michael-scott.png' },
    { value: 'The Joker', emoji: '/assets/icons/the-joker.png' },
    { value: 'Tony Stark', emoji: '/assets/icons/iron-man.png' },
    { value: 'Yoda', emoji: '/assets/icons/yoda-yoga.png' },
    // maquieavel, gengish kan
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
      {personalities.map((tone) => (
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
