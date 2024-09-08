import { topLanguages } from '@rewritepal/lib/constants/languages'
import { ListItem } from '@rewritepal/lib/interfaces/items'
import { useLanguageStore } from '@rewritepal/stores/language'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export default function LanguageSelect() {
  const { selectedLanguage, setLanguage } = useLanguageStore()

  return (
    <Select onValueChange={setLanguage} value={selectedLanguage}>
      <SelectTrigger className='w-[200px]'>
        <SelectValue placeholder='Language' />
      </SelectTrigger>
      <SelectContent>
        {topLanguages.map(({ value, emoji }: ListItem) => (
          <SelectItem key={value} value={value} id={value} aria-label={value}>
            {emoji} {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
