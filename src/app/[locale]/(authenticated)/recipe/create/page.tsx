import { RecipeProvider } from '../context/RecipeContext'
import CreateRecipeClient from './CreateRecipeClient'
import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import { HydrationLoader } from '@/app/api/loading/HydrationLoader'

export default function NewRecipePage({ mode }: { mode: 'create' | 'edit' }) {
  return (
    <RecipeProvider mode={mode}>
      <DualSidebarLayout isLeftSidebarExpanded={true}>
        <HydrationLoader>
          <CreateRecipeClient mode={mode} />
        </HydrationLoader>
      </DualSidebarLayout>
    </RecipeProvider>
  )
}
