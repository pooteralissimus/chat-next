import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export const POST = async (req: NextRequest) => {

  try {

    const { thread, message } = await req.json()

    // create message
    openai.beta.threads.messages.create(
      thread.id, {
        role: 'user',
        content: message,
      },
    )

    // create run
    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.ASSISTANT_ID!,
    })


    // wait for answer
    while (run.status !== 'completed') {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      run = await openai.beta.threads.runs.retrieve(thread.id, run.id)
    }


    // get message
    const assistantMessages = await openai.beta.threads.messages.list(thread.id, { run_id: run.id })


    const m = assistantMessages.data.pop()!

    if (m.content[0].type === 'text') {
      console.log('m.content[0]', m.content[0])


      const { text } = m.content[0]
      const { annotations } = text

      annotations.forEach((annotation) => {
        if (annotation.type === 'file_citation')
          text.value = text.value.replace(annotation.text, '')
      })

      return NextResponse.json({
        status: 'Success',
        code: 200,
        data: text.value,
      })
    }

  } catch (e) {
    console.error('error:', e)
    return NextResponse.json({ status: 'Error', code: 400, data: e })
  }
}
