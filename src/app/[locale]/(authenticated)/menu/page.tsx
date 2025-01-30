'use client'

import React from 'react'
import MenuLayout from './layout'
import MenuClient from './MenuClient'
import { MenuProvider } from './context/MenuContext'
import { Providers } from '@/app/api/providers/providers'

const MenuPage: React.FC = () => {
  return (
    <Providers messages={{}} locale='en'>
      <MenuLayout>
        <MenuProvider>
          <MenuClient mode='create' />
        </MenuProvider>
      </MenuLayout>
    </Providers>
  )
}

export default MenuPage
