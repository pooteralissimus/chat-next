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

    //////////////////

    // const response3 = await fetch('/api/send-message', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     thread: responseData2.data.thread,
    //     message: 'Hello',
    //   }),
    // })
    //
    // const responseData3 = (await response3.json()) as any
    // console.log('responseData3', JSON.parse(responseData3.data.replace(/```json|```/g, '').trim()))
  }

  return (
    <main>
      <Chat thread={thread}></Chat>
    </main>
  )
}

export default Page
