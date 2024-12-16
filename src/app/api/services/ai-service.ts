import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { AIMessage, AIStreamResponse } from '@/app/api/types/ai'
import OpenAI from 'openai'

interface TierLimits {
  maxTokens: number
  requestsPerDay: number
  temperature: number
  features: string[]
}

const TIER_LIMITS: Record<ProfileTier, TierLimits> = {
  [ProfileTier.FREE]: {
    maxTokens: 500,
    requestsPerDay: 10,
    temperature: 0.7,
    features: ['basic_recipes', 'simple_substitutions'],
  },
  [ProfileTier.PRO]: {
    maxTokens: 1500,
    requestsPerDay: 50,
    temperature: 0.8,
    features: ['advanced_techniques', 'recipe_scaling', 'professional_tips'],
  },
  [ProfileTier.GROUP]: {
    maxTokens: 3000,
    requestsPerDay: 100,
    temperature: 0.9,
    features: ['team_planning', 'bulk_recipes', 'kitchen_management'],
  },
}

const TIER_PROMPTS = {
  [ProfileTier.FREE]: `You are CookMore's culinary AI assistant for basic users.
RESPONSE RULES:
- NO markdown formatting
- Use plain text only
- Use simple dashes (-) for lists
- Keep responses under 100 words
- Use natural, conversational language
- Format measurements like "2 cups" not "2 c."
- Separate sections with blank lines`,

  [ProfileTier.PRO]: `You are CookMore's culinary AI assistant for professional users.
RESPONSE RULES:
- NO markdown formatting
- Use plain text only
- Use dashes (-) for lists
- Include precise measurements
- Separate sections with blank lines
- Format temperatures like "350°F (175°C)"
- Use professional but clear language`,

  [ProfileTier.GROUP]: `You are CookMore's culinary AI assistant for team users.
RESPONSE RULES:
- NO markdown formatting
- Use plain text only
- Use dashes (-) for lists
- Include scaling information
- Separate sections with blank lines
- Include equipment lists
- Format quantities for teams`,
}

const FORMATTING_INSTRUCTIONS = `Format your responses using these conventions:
- Use a clear title/header for main topics
- Use blank lines between sections
- Use bullets (•) or dashes (-) for lists
- Use **bold** for emphasis
- Format measurements consistently (e.g., "2 cups", "350°F")
- Use blank lines to separate different parts of the response
- Keep paragraphs short and readable`

export class AIService {
  private openai: OpenAI
  private static instance: AIService | null = null

  private constructor() {
    const apiKey =
      typeof window === 'undefined'
        ? process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
        : process.env.NEXT_PUBLIC_OPENAI_API_KEY

    if (!apiKey) {
      throw new Error('OpenAI API key is required. Please check your environment variables.')
    }

    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: typeof window !== 'undefined',
    })
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  async processMessage(
    message: string,
    tier: ProfileTier,
    context?: { recipeId?: string }
  ): Promise<ReadableStream<AIStreamResponse>> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: TIER_PROMPTS[tier],
          },
          {
            role: 'system',
            content: FORMATTING_INSTRUCTIONS,
          },
          { role: 'user', content: message },
        ],
        stream: true,
        temperature: TIER_LIMITS[tier].temperature,
        max_tokens: TIER_LIMITS[tier].maxTokens,
      })

      return this.createStream(response)
    } catch (error) {
      console.error('OpenAI API Error:', error)
      throw error
    }
  }

  private createStream(response: any): ReadableStream<AIStreamResponse> {
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          controller.enqueue({
            id: chunk.id,
            choices: [
              {
                delta: {
                  content: chunk.choices[0]?.delta?.content || '',
                  role: chunk.choices[0]?.delta?.role,
                },
                finishReason: chunk.choices[0]?.finish_reason,
              },
            ],
          })
        }
        controller.close()
      },
    })
  }
}

// Create and export the singleton instance
export const aiService = AIService.getInstance()
