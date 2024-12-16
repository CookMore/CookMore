import { createContext, useContext, useReducer, ReactNode } from 'react'
import { RecipeData } from '@/app/api/types/recipe'

interface RecipeState {
  currentStep: number
  recipeData: Partial<RecipeData>
  isValid: boolean
}

type RecipeAction =
  | { type: 'UPDATE_RECIPE_DATA'; payload: Partial<RecipeData> }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'VALIDATE_STEP'; payload: boolean }

const initialState: RecipeState = {
  currentStep: 0,
  recipeData: {},
  isValid: false,
}

const RecipeContext = createContext<
  | {
      state: RecipeState
      dispatch: React.Dispatch<RecipeAction>
    }
  | undefined
>(undefined)

function recipeReducer(state: RecipeState, action: RecipeAction): RecipeState {
  switch (action.type) {
    case 'UPDATE_RECIPE_DATA':
      return {
        ...state,
        recipeData: {
          ...state.recipeData,
          ...action.payload,
        },
      }
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
      }
    case 'VALIDATE_STEP':
      return {
        ...state,
        isValid: action.payload,
      }
    default:
      return state
  }
}

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(recipeReducer, initialState)

  return <RecipeContext.Provider value={{ state, dispatch }}>{children}</RecipeContext.Provider>
}

export function useRecipe() {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error('useRecipe must be used within a RecipeProvider')
  }
  return context
}
