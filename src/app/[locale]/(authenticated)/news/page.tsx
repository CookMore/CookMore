'use client'

import React from 'react'
import NewsLayout from './layout'
import NewsClient from './NewsClient'

const NewsPage: React.FC = () => {
  return (
    <NewsLayout>
      <NewsClient />
    </NewsLayout>
  )
}

export default NewsPage
