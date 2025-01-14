import { z } from 'zod'
import { RecipeMetadata, RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

// Schema for RecipeMetadata
const recipeMetadataSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  version: z.string().optional(),
  owner: z.string().optional(),
  status: z.enum(['alpha', 'beta', 'stable']).optional(),
  visibility: z.enum(['private', 'allowlist', 'public']).optional(),
  license: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

// Schema for RecipeData
const recipeDataSchema = recipeMetadataSchema.extend({
  servings: z.number().min(1, 'Servings must be at least 1').optional(),
  prepTime: z.number().min(1, 'Preparation time is required'),
  cookTime: z.number().min(1, 'Cooking time is required'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']).optional(),
  dietary: z.array(z.string()).optional(),
  portionSize: z.string().optional(),
  totalYield: z.string().optional(),
  categories: z.array(z.string()).optional(),
  cuisines: z.array(z.string()).optional(),
  occasions: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  customTags: z.array(z.string()).optional(),
  skills: z.object({
    required: z.array(z.string()),
    recommended: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional(),
    training: z.array(z.string()).optional(),
  }),
  ingredients: z
    .array(
      z.object({
        groupName: z.string().optional(),
        items: z.array(
          z.object({
            ingredient: z.string(),
            quantity: z.string(),
            unit: z.string(),
          })
        ),
      })
    )
    .optional(),
  specialtyIngredients: z
    .array(
      z.object({
        item: z.string(),
        source: z.string(),
        substitute: z.string(),
        notes: z.string(),
        handling: z.string(),
      })
    )
    .optional(),
  equipment: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      optional: z.boolean().optional(),
    })
  ),
  preProduction: z
    .array(
      z.object({
        task: z.string(),
        timeframe: z.string(),
        notes: z.string(),
      })
    )
    .optional(),
  productionMethod: z
    .object({
      defaultFlow: z.array(
        z.object({
          id: z.string(),
          type: z.string(),
          content: z.string(),
          time: z.number().optional(),
          timeUnit: z.enum(['minutes', 'hours']),
          ingredients: z.array(z.string()),
          warning: z.string().optional(),
          notes: z.array(z.string()).optional(),
          image: z.string().optional(),
        })
      ),
      modules: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
            steps: z.array(
              z.object({
                id: z.string(),
                type: z.string(),
                content: z.string(),
                time: z.number().optional(),
                timeUnit: z.enum(['minutes', 'hours']),
                ingredients: z.array(z.string()),
                warning: z.string().optional(),
                notes: z.array(z.string()).optional(),
                image: z.string().optional(),
              })
            ),
          })
        )
        .optional(),
    })
    .optional(),
  haccpPlan: z
    .array(
      z.object({
        step: z.string(),
        hazards: z.array(z.string()),
        controls: z.array(z.string()),
      })
    )
    .optional(),
  servingPlating: z
    .object({
      instructions: z.array(z.string()),
      temperature: z.string(),
      timing: z.string(),
      notes: z.string().optional(),
      presentation: z.array(z.string()).optional(),
      garnish: z.array(z.string()).optional(),
      service: z.array(z.string()).optional(),
      image: z.string().optional(),
    })
    .optional(),
  finishingTouch: z
    .object({
      notes: z.string().optional(),
      presentation: z.string().optional(),
      image: z.string().optional(),
    })
    .optional(),
  finalImage: z.string().optional(),
  coverImage: z.string().optional(),
  videoUrl: z.string().optional(),
  inspiration: z
    .object({
      sources: z.array(z.string()).optional(),
      images: z.array(z.string()).optional(),
      notes: z.string().optional(),
    })
    .optional(),
  signatures: z
    .array(
      z.object({
        address: z.string(),
        signature: z.string(),
        timestamp: z.number(),
      })
    )
    .optional(),
  versions: z
    .array(
      z.object({
        id: z.string(),
        message: z.string(),
        changes: z.object({}).optional(),
        timestamp: z.date(),
        parentId: z.string().nullable(),
      })
    )
    .optional(),
  currentVersionId: z.string().optional(),
  forks: z.array(z.string()).optional(),
  isDraft: z.boolean().optional(),
  cookCount: z.number().optional(),
  likes: z.number().optional(),
  comments: z.number().optional(),
  image: z.string().optional(),
  changeLogDetails: z
    .object({
      entries: z.array(
        z.object({
          version: z.string(),
          type: z.string(),
          date: z.string(),
          author: z.string(),
          message: z.string(),
        })
      ),
    })
    .optional(),
})

// Export the schemas and types for use in other components
export { recipeMetadataSchema, recipeDataSchema }

export function validateStep(stepId: string, data: RecipeData) {
  try {
    recipeDataSchema.parse(data)
    return {}
  } catch (error) {
    return error.errors.reduce((acc: Record<string, string[]>, err: any) => {
      acc[err.path[0]] = acc[err.path[0]] || []
      acc[err.path[0]].push(err.message)
      return acc
    }, {})
  }
}
