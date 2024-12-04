import { RecipeData } from '@/types/recipe'

export const mockRecipes: RecipeData[] = [
  {
    id: '1',
    title: 'Example Recipe',
    description: 'A test recipe',
    version: '1.0',
    owner: 'user1',
    status: 'alpha',
    forkedFrom: undefined,
    visibility: 'public',
    license: 'MIT',
    servings: 4,
    prepTime: 30,
    cookTime: 45,
    difficulty: 'medium',
    dietary: ['vegan'],
    portionSize: '1 cup',
    totalYield: '4 servings',
    categories: ['Dinner'],
    cuisines: ['Italian'],
    occasions: ['Party'],
    tags: ['quick', 'easy'],
    customTags: ['family favorite'],
    skills: {
      required: ['chopping', 'boiling'],
      recommended: ['sautéing'],
      certifications: ['Food Safety'],
      training: ['Basic Cooking'],
    },
    ingredients: [],
    specialtyIngredients: [],
    equipment: [],
    preProduction: [],
    productionMethod: {
      defaultFlow: [],
      modules: [],
    },
    haccpPlan: [],
    servingPlating: {
      instructions: ['Serve hot'],
      temperature: 'Hot',
      timing: 'Immediate',
      notes: 'Best served fresh',
      presentation: ['Garnish with parsley'],
      garnish: ['Parsley'],
      service: ['Plate'],
      image: 'path/to/image.jpg',
    },
    finishingTouch: {
      notes: ['Add a pinch of salt before serving'],
    },
    finalImage: 'path/to/final-image.jpg',
    coverImage: 'path/to/cover-image.jpg',
    videoUrl: 'https://example.com/video',
    inspiration: {
      sources: ["Grandma's recipe book"],
      images: ['path/to/inspiration-image.jpg'],
      notes: 'Inspired by traditional family recipes',
    },
    pairings: [
      {
        category: 'Wine',
        items: ['Chardonnay'],
        notes: 'Pairs well with white wine',
      },
    ],
    review: {
      notes: 'Delicious and easy to make',
      improvements: ['Add more garlic'],
      rating: 4.5,
      comments: ['Loved it!', 'Will make again'],
    },
    variations: [
      {
        name: 'Spicy Version',
        description: 'Add chili flakes for a spicy kick',
        changes: ['Add 1 tsp chili flakes'],
      },
    ],
    changeLog: [
      {
        version: '1.0',
        type: 'Initial Release',
        date: '2023-01-01',
        author: 'user1',
        message: 'Initial version of the recipe',
      },
    ],
    allowlist: ['user2', 'user3'],
    forkCount: 0,
    finishingNotes: ['Ensure all ingredients are fresh'],
    privacySettings: {
      allowlist: ['user2', 'user3'],
    },
    necessarySkills: {
      skills: {
        required: ['chopping', 'boiling'],
        recommended: ['sautéing'],
        certifications: ['Food Safety'],
        training: ['Basic Cooking'],
      },
    },
    methodProduction: {
      defaultFlow: [],
      modules: [],
    },
    servingPlatingDetails: {
      instructions: ['Serve hot'],
      temperature: 'Hot',
      timing: 'Immediate',
    },
    pairingsDetails: {
      pairings: [
        {
          category: 'Wine',
          items: ['Chardonnay'],
          notes: 'Pairs well with white wine',
        },
      ],
    },
    changeLogDetails: {
      entries: [
        {
          version: '1.0',
          type: 'Initial Release',
          date: '2023-01-01',
          author: 'user1',
          message: 'Initial version of the recipe',
        },
      ],
    },
    specialtyIngredientsDetails: {
      specialtyIngredients: [],
    },
    preProductionDetails: {
      tasks: [],
    },
    tagsDetails: {
      categories: ['Dinner'],
      cuisines: ['Italian'],
      occasions: ['Party'],
      customTags: ['family favorite'],
    },
    finalImageDetails: {
      finalImage: 'path/to/final-image.jpg',
    },
    finishingTouchDetails: {
      notes: ['Add a pinch of salt before serving'],
    },
    reviewDetails: {
      signatures: [
        {
          address: '0x123',
          signature: '0xabc',
          timestamp: 1672531200,
        },
      ],
    },
    mintDetails: {
      reviewers: [
        {
          address: '0x123',
          hasSigned: true,
          signature: '0xabc',
          timestamp: 1672531200,
        },
      ],
    },
  },
  // Add more mock recipes as needed
]
