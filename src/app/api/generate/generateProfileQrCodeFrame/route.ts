import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { qrCodeData } = req.body

    try {
      const apiKey = process.env.NEYAR_API_KEY // Securely stored in environment variables
      const response = await fetch('https://farcaster-api.example.com/create-frame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ data: qrCodeData }),
      })

      if (!response.ok) {
        throw new Error('Failed to create frame')
      }

      const result = await response.json()
      res.status(200).json(result)
    } catch (error) {
      console.error('Error creating frame:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
