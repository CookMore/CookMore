import React, { useEffect, Suspense, useCallback, useRef } from 'react'
import { useRecipe } from '../context/RecipeContext'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'
import { debounce, isEqual } from 'lodash'

interface RecipeCertificateProps {
  recipeData: RecipeData
  validationErrors: Record<string, string>[]
  formData: any
  isOpen: boolean
}

export function RecipeCertificate({
  recipeData,
  validationErrors,
  formData,
  isOpen,
}: RecipeCertificateProps) {
  const { updateRecipe } = useRecipe()
  const latestDataRef = useRef<RecipeData>(recipeData)
  const [hydratedData, setHydratedData] = React.useState<RecipeData | null>(null)

  useEffect(() => {
    latestDataRef.current = recipeData
  }, [recipeData])

  const debouncedUpdateRecipe = useCallback(
    debounce(async (completeData: RecipeData) => {
      if (!isEqual(latestDataRef.current, completeData)) {
        try {
          await updateRecipe(completeData)
        } catch (error) {
          console.error('Error updating recipe:', error)
        }
      }
    }, 300),
    []
  )

  const fillDefaults = (data: Partial<RecipeData>): RecipeData => {
    const defaultData: RecipeData = {
      title: '',
      description: '',
      prepTime: 1,
      cookTime: 1,
      servings: 1,
      difficulty: 'easy' as any,
      dietary: [],
      portionSize: '',
      totalYield: '',
      categories: [],
      cuisines: [],
      occasions: [],
      tags: [],
      customTags: [],
      skills: {
        required: [],
        recommended: [],
        certifications: [],
        training: [],
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
        instructions: [],
        temperature: '',
        timing: '',
        notes: '',
        presentation: [],
        garnish: [],
        service: [],
        image: '',
      },
      finishingTouch: {
        notes: '',
        presentation: '',
        image: '',
      },
      finalImage: '',
      coverImage: '',
      videoUrl: '',
      inspiration: {
        sources: [],
        images: [],
        notes: '',
      },
      signatures: [],
      versions: [],
      currentVersionId: '',
      forks: [],
      isDraft: false,
      cookCount: 0,
      likes: 0,
      comments: 0,
      image: '',
      changeLogDetails: {
        entries: [],
      },
    }
    return {
      ...defaultData,
      ...data,
    }
  }

  useEffect(() => {
    if (isOpen) {
      const completeData = fillDefaults({ ...recipeData, ...formData })
      setHydratedData(completeData)
      debouncedUpdateRecipe(completeData)
    }
  }, [recipeData, formData, isOpen])

  if (!isOpen || !hydratedData) return null

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='recipe-certificate overflow-y-auto h-[500px] bg-white dark:bg-gray-900 p-2 border border-github-border-default rounded-lg'>
        {validationErrors.map((errors, index) => (
          <div key={index} className='validation-errors'>
            {Object.entries(errors).map(([field, error]) => (
              <p key={field} className='error text-sm text-black dark:text-white'>
                {field}: {String(error)}
              </p>
            ))}
          </div>
        ))}
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Title</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.title}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Description</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.description}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Preparation Time</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.prepTime} minutes
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Version</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.version}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Owner</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.owner}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Status</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.status}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Visibility</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.visibility}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>License</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.license}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Created At</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.createdAt?.toLocaleDateString()}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Updated At</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.updatedAt?.toLocaleDateString()}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Servings</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.servings}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Cook Time</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.cookTime} minutes
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Difficulty</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.difficulty}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Dietary</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.dietary?.join(', ')}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Portion Size</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.portionSize}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Total Yield</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.totalYield}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Categories</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.categories?.join(', ')}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Cuisines</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.cuisines?.join(', ')}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Occasions</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.occasions?.join(', ')}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Tags</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.tags?.join(', ')}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Custom Tags</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.customTags?.join(', ')}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Skills Required</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.skills?.required.join(', ')}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Skills Recommended</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.skills?.recommended?.join(', ')}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Certifications</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.skills?.certifications?.join(', ')}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Training</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.skills?.training?.join(', ')}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Final Image</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            <img src={hydratedData.finalImage} alt='Final Image' className='rounded-md' />
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Cover Image</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            <img src={hydratedData.coverImage} alt='Cover Image' className='rounded-md' />
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Video URL</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.videoUrl}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Inspiration</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.inspiration?.notes}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Signatures</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.signatures?.map((sig) => sig.signature).join(', ')}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Versions</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.versions?.map((ver) => ver.id).join(', ')}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Current Version ID</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.currentVersionId}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Forks</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.forks?.join(', ')}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Is Draft</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.isDraft ? 'Yes' : 'No'}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Cook Count</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.cookCount}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Likes</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.likes}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Comments</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.comments}
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Image</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            <img src={hydratedData.image} alt='Image' className='rounded-md' />
          </p>
        </div>
        <hr className='my-2 border-github-border-default' />
        <div className='mb-2'>
          <h2 className='text-lg font-semibold text-github-fg-default mb-1'>Change Log Details</h2>
          <p className='bg-gray-100 dark:bg-gray-700 p-1 rounded-md text-sm text-black dark:text-white'>
            {hydratedData.changeLogDetails?.entries.map((entry) => entry.message).join(', ')}
          </p>
        </div>
      </div>
    </Suspense>
  )
}

export default RecipeCertificate
