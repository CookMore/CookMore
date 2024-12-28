import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { timeToCook, cuisineType, preferences, dietaryRestrictions, inspiration, tier } =
      await req.json()

    const prompt = `Generate a meal plan with the following requirements:
    - Cooking Time: ${timeToCook}
    - Cuisine Type: ${cuisineType}
    - Dietary Preferences: ${preferences.join(', ')}
    - Restrictions: ${dietaryRestrictions}
    - Additional Notes: ${inspiration}
    - User Tier: ${tier}

    Please provide a detailed meal plan including ingredients and cooking instructions.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional chef and meal planning assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    })

    return NextResponse.json({
      mealPlan: response.choices[0].message.content,
    })
  } catch (error) {
    console.error('Error generating meal plan:', error)
    return NextResponse.json({ error: 'Failed to generate meal plan' }, { status: 500 })
  }
}
