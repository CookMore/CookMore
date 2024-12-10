import { z } from 'zod'

export const recipeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  servings: z.number().min(1).optional(),
  prepTime: z.number().min(1).optional(),
  cookTime: z.number().min(1).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  cuisine: z.string().optional(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      unit: z.string(),
      notes: z.string().optional(),
    })
  ),
  instructions: z.array(
    z.object({
      step: z.number(),
      text: z.string(),
      image: z.string().optional(),
    })
  ),
  equipment: z
    .array(
      z.object({
        name: z.string(),
        quantity: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .optional(),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  version: z.string().default('1.0'),
})

export type RecipeFormData = z.infer<typeof recipeSchema>
