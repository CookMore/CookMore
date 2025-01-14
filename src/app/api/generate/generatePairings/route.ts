import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json()

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Use the completions endpoint
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: `Suggest pairings for: ${input}`,
      max_tokens: 100,
    })

    // Send back the suggestions
    return NextResponse.json({
      suggestions: response.choices[0].text.trim(),
    })
  } catch (error) {
    console.error('Error generating pairings:', error)
    return new Response(JSON.stringify({ message: 'Error generating pairings' }), { status: 500 })
  }
}
