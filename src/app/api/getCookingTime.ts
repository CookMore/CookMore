import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { item } = req.body

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: `How long should I cook a ${item}?`,
        max_tokens: 50,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    )

    const suggestion = response.data.choices[0].text.trim()
    res.status(200).json({ suggestion })
  } catch (error) {
    console.error('Error fetching cooking time:', error)
    res.status(500).json({ error: 'Failed to fetch cooking time' })
  }
}
