import { useState } from 'react'

export default function RadioComponent({ selectLimit }: { selectLimit: number }) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]) // Add type annotation for selectedOptions

  const handleOptionChange = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption !== option))
    } else if (selectedOptions.length < selectLimit) {
      setSelectedOptions([...selectedOptions, option])
    }
  }

  const options = ['personable', 'confident', 'empathetic', 'engaging', 'formal', 'direct', 'funny']

  return (
    <div className='flex flex-wrap gap-2'>
      {options.map((option) => (
        <label
          key={option}
          className={`bg-gray-200 p-2 rounded-md cursor-pointer ${
            selectedOptions.includes(option) ? 'bg-blue-500 text-white' : ''
          }`}>
          <input
            type='checkbox'
            className='hidden'
            checked={selectedOptions.includes(option)}
            onChange={() => handleOptionChange(option)}
          />
          {option}
        </label>
      ))}
    </div>
  )
}
