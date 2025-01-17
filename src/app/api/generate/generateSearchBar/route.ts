import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Search for: ${query}`,
        },
      ],
      max_tokens: 50,
    })

    return NextResponse.json({
      result: response.choices[0]?.message?.content?.trim() || 'No content available',
    })
  } catch (error) {
    console.error('Error with OpenAI API:', error)
    return NextResponse.json({ error: 'Error with OpenAI API' }, { status: 500 })
  }
}
