import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json()

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use a supported chat model
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: `Provide only the semantic version number for a recipe titled "${title}". Use the format V.MAJOR.MINOR.PATCH.`,
        },
      ],
      max_tokens: 10, // Reduce tokens to limit response length
    })

    const version = response.choices[0].message?.content?.trim() || 'Version not generated'
    return NextResponse.json({ title, version })
  } catch (error: any) {
    console.error('Error generating version:', error.response ? error.response.data : error.message)
    return NextResponse.json({ error: 'Failed to generate version' }, { status: 500 })
  }
}
