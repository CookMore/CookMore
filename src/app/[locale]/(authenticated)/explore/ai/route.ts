import { NextRequest } from 'next/server'
import { ProfileTier } from '@/app/api/types/profile'
import { aiService } from '@/app/api/services/ai-service'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { message, tier, context } = await req.json()

    // Validate tier access
    if (!tier || !Object.values(ProfileTier).includes(tier)) {
      return new Response('Invalid tier', { status: 400 })
    }

    const stream = await aiService.processMessage(message, tier, context)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('AI Chat Error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
