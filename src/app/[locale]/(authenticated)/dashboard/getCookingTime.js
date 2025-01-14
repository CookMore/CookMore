'use server'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { item } = req.body
      const prompt = `Suggest a cooking timer for the following item: ${item}`

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a cooking assistant providing timer suggestions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      })

      res
        .status(200)
        .json({ suggestion: response.choices[0].message.content || 'No suggestion available' })
    } catch (error) {
      console.error('Error getting timer suggestion:', error)
      res.status(500).json({ error: 'Failed to get suggestion' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
