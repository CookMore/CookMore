import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { ingredients } = req.body

    const prompt = `Refine the following ingredients into a shopping list with appropriate quantities and units for shopping:
${ingredients.join('\n')}`

    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 150,
    })

    const refinedList = response.choices[0].text.trim().split('\n')

    res.status(200).json({ refinedList })
  } catch (error) {
    console.error('Error refining shopping list:', error)
    res.status(500).json({ error: 'Failed to refine shopping list' })
  }
}
