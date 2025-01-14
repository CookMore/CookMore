import { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { input } = req.body

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: `Suggest pairings for: ${input}`,
      max_tokens: 100,
    })

    res.status(200).json({ suggestions: response.choices[0].text.trim() })
  } catch (error) {
    console.error('Error generating pairings:', error)
    res.status(500).json({ message: 'Error generating pairings' })
  }
}
