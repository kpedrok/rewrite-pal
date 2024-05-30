'use client'

import toast from 'react-hot-toast'

export async function saveEmail(formData: FormData) {
  const email = formData.get('email')

  const postEmail = async (email: string) => {
    await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    })
  }

  function validateEmail(email: FormDataEntryValue): boolean {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  if (email && validateEmail(email)) {
    postEmail(email.toString())
    toast.success(`Email submitted. Thanks!`)
  } else {
    toast.error(`Email Invalid.`)
  }
}
