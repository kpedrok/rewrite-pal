'use client' // this registers <Editor> as a Client Component
import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { useCreateBlockNote } from '@blocknote/react'

export default function Editor() {
  const editor = useCreateBlockNote()
  return <BlockNoteView editor={editor} theme={'light'} className='p-4 pt-16 bg-white ' />
}
