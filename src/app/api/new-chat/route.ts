import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export const POST = async () => {
  try {
    const thread = await openai.beta.threads.create()

    return NextResponse.json({
      status: 'Success',
      code: 200,
      data: { thread },
    })
  } catch (e) {
    console.error('error:', e)
    return NextResponse.json({ status: 'Error', code: 400, data: e })
  }
}
