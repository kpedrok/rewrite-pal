import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

type Language = {
  name: string
  emoji: string
}

const topLanguages: Language[] = [
  { name: 'Bengali', emoji: '🇧🇩' },
  { name: 'Chinese', emoji: '🇨🇳' },
  { name: 'English', emoji: '🇺🇸' },
  { name: 'French', emoji: '🇫🇷' },
  { name: 'German', emoji: '🇩🇪' },
  { name: 'Hindi', emoji: '🇮🇳' },
  { name: 'Italian', emoji: '🇮🇹' },
  { name: 'Japanese', emoji: '🇯🇵' },
  { name: 'Korean', emoji: '🇰🇷' },
  { name: 'Polish', emoji: '🇵🇱' },
  { name: 'Portuguese', emoji: '🇧🇷' },
  { name: 'Russian', emoji: '🇷🇺' },
  { name: 'Spanish', emoji: '🇪🇸' },
  { name: 'Tamil', emoji: '🇱🇰' },
  { name: 'Telugu', emoji: '🇮🇳' },
  { name: 'Turkish', emoji: '🇹🇷' },
  { name: 'Ukrainian', emoji: '🇺🇦' },
  { name: 'Urdu', emoji: '🇵🇰' },
  { name: 'Vietnamese', emoji: '🇻🇳' },
]

export default function LanguageSelect() {
  const [language, setLanguage] = useState<string | undefined>(undefined)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    } else {
      setLanguage('English')
    }
  }, [])

  useEffect(() => {
    if (language === undefined) return
    localStorage.setItem('selectedLanguage', language)
  }, [language])

  return (
    <Select onValueChange={setLanguage} value={language}>
      <SelectTrigger className='w-[200px]'>
        <SelectValue placeholder='Language' />
      </SelectTrigger>
      <SelectContent>
        {topLanguages.map((language) => (
          <SelectItem key={language.name} value={language.name} id={language.name} aria-label={language.name}>
            {language.emoji} {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
