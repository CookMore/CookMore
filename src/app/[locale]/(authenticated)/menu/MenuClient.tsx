import React, { useState } from 'react'
import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import MenuSidebar from './components/MenuSidebar'
import MenuBuilder from './components/MenuBuilder'
import MenuSearchBar from './components/MenuSearchBar'
import MenuCalculator from './components/MenuCalculator'
import MenuPreview from './components/MenuPreview'
import MenuShare from './components/MenuShare'
import MenuOptimization from './components/MenuOptimization'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'

interface MenuClientProps {
  mode: 'create' | 'update'
}

const MenuClient: React.FC<MenuClientProps> = ({ mode }) => {
  const { theme } = useTheme()
  const [sections, setSections] = useState({
    soup: [],
    salad: [],
    bread: [],
    appetizer: [],
    'main-course': [],
    dessert: [],
  })

  return (
    <DualSidebarLayout leftSidebar={<MenuSidebar />} isLeftSidebarExpanded={true}>
      <div>
        <MenuSearchBar />
      </div>
      <div className='flex flex-col lg:flex-row'>
        <div className='flex-1'>
          <MenuBuilder sections={sections} setSections={setSections} />
        </div>
        <div className='flex-1'>
          <MenuPreview sections={sections} />
        </div>
      </div>
      <div>
        <MenuCalculator />
        <MenuShare />
        <MenuOptimization />
      </div>
    </DualSidebarLayout>
  )
}

export default MenuClient
