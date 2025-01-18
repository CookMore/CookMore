import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { preferences } = req.body

  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: `Create a meal plan based on the following preferences: ${preferences}`,
      max_tokens: 150,
    })

    const mealPlan = response.choices[0].text.trim()

    res.status(200).json({ mealPlan })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate meal plan' })
  }
}
