import { RecipeData } from '@/types/recipe'
import * as z from 'zod'

const titleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
})

const versionSchema = z.object({
  version: z.string().min(1, 'Version is required'),
  variations: z.number().optional(),
  options: z.number().optional(),
  status: z.enum(['alpha', 'beta', 'stable']).optional(),
})

// Add more schemas for other steps...

const schemas: Record<string, z.ZodSchema> = {
  title: titleSchema,
  version: versionSchema,
  // Add more schemas here...
}

export async function validateStep(
  stepId: string,
  data: Partial<RecipeData>
): Promise<Record<string, string[]>> {
  const schema = schemas[stepId]
  if (!schema) return {}

  try {
    await schema.parseAsync(data)
    return {}
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        [stepId]: error.errors.map((err) => err.message),
      }
    }
    return {
      [stepId]: ['An unexpected error occurred'],
    }
  }
}
