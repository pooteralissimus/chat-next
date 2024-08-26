'use client'
import Chat from '../components/pages/chat'

import { FC, useEffect, useState } from 'react'

type PageProps = {};

const Page: FC<PageProps> = ({}) => {

  const [thread, setThread] = useState()

  useEffect(() => {
    testFunction()
  }, [])

  const testFunction = async () => {

    const response2 = await fetch('/api/new-chat', {
      method: 'POST',
    })

    const responseData2 = (await response2.json()) as any

    console.log('responseData2', responseData2)

    setThread(responseData2.data.thread)
  }

  return (
    <main>
      <Chat thread={thread}></Chat>
    </main>
  )
}

export default Page
