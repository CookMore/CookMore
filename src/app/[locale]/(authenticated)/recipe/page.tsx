'use client'

import { useState } from 'react'
import { StepsSidebar } from '@/components/recipes/StepsSidebar'
import { RecipeSteps } from '@/components/recipes/RecipeSteps'
import { RecipePreview } from '@/components/recipes/RecipePreview'
import { RecipeProvider } from '@/app/api/providers/RecipeProvider'
import { PanelContainer } from '@/components/panels/PanelContainer'
import { IconEye, IconEdit } from '@/components/ui/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { SessionWarning } from '@/components/recipes/steps/SessionWarning'

export default function NewRecipePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  return (
    <RecipeProvider>
      <div className='flex flex-col'>
        <PageHeader title='Create Recipe' />
        <SessionWarning />
        <div className='flex'>
          <StepsSidebar
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            isExpanded={sidebarExpanded}
            setIsExpanded={setSidebarExpanded}
          />

          <PanelContainer>
            <div className='flex-1'>
              {/* Mobile Preview Toggle */}
              <div className='sticky top-0 z-10 xl:hidden bg-github-canvas-default border-b border-github-border-default'>
                <div className='flex p-2 gap-2'>
                  <button
                    onClick={() => setShowPreview(false)}
                    className={`
                      flex-1 px-4 py-2 rounded-md flex items-center justify-center gap-2
                      ${
                        !showPreview
                          ? 'bg-github-accent-emphasis text-white'
                          : 'text-github-fg-muted'
                      }
                    `}
                  >
                    <IconEdit className='w-4 h-4' />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    className={`
                      flex-1 px-4 py-2 rounded-md flex items-center justify-center gap-2
                      ${
                        showPreview
                          ? 'bg-github-accent-emphasis text-white'
                          : 'text-github-fg-muted'
                      }
                    `}
                  >
                    <IconEye className='w-4 h-4' />
                    Preview
                  </button>
                </div>
              </div>

              {/* Content Container */}
              <div className='max-w-screen-xl mx-auto'>
                <div className='grid grid-cols-1 xl:grid-cols-[1fr,auto,1fr] gap-0'>
                  {/* Recipe Steps - Hidden on mobile when preview is shown */}
                  <div className={`${showPreview ? 'hidden xl:block' : ''}`}>
                    <RecipeSteps currentStep={currentStep} setCurrentStep={setCurrentStep} />
                  </div>

                  {/* Vertical Divider - Only visible on xl */}
                  <div className='hidden xl:flex items-center'>
                    <div className='w-[1px] h-full bg-github-border-default'></div>
                  </div>

                  {/* Preview Panel - Shown on mobile when toggled, always visible on xl */}
                  <div className={`${showPreview ? 'block' : 'hidden xl:block'} px-4 lg:px-8`}>
                    <RecipePreview selectedStepIndex={currentStep} />
                  </div>
                </div>
              </div>
            </div>
          </PanelContainer>
        </div>
      </div>
    </RecipeProvider>
  )
}
