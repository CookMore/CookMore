import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { AIStreamResponse } from '@/app/api/types/ai'
import { OpenAIStream as AIStream } from 'ai'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function OpenAIStream(
  message: string,
  tier: ProfileTier,
  context?: { recipeId?: string }
): Promise<ReadableStream> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: getTierSpecificPrompt(tier),
      },
      { role: 'user', content: message },
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 1000,
  })

  return AIStream(response)
}

function getTierSpecificPrompt(tier: ProfileTier): string {
  const basePrompt = `You are a culinary AI assistant focused on helping with recipes and cooking techniques.`

  switch (tier) {
    case ProfileTier.FREE:
      return `${basePrompt} Provide basic recipe suggestions and simple cooking tips.`
    case ProfileTier.PRO:
      return `${basePrompt} Offer advanced culinary techniques, detailed recipe modifications, and professional kitchen advice.`
    case ProfileTier.GROUP:
      return `${basePrompt} Provide collaborative cooking guidance, team recipe planning, and professional kitchen management advice.`
    default:
      return basePrompt
  }
}
