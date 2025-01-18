'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NewsFilterBar from './NewsFilterBar'
import approvedSources from './approvedSources.json' // Import the JSON file

interface Article {
  title: string
  url: string
  url_mobile: string
  language: string
  domain: string
  socialimage: string
  seendate: string
  sourcecountry: string
  category: string
  importance?: number
}

const NewsClient: React.FC = () => {
  const [allArticles, setAllArticles] = useState<Article[]>([]) // Store all fetched articles
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [countryFilter, setCountryFilter] = useState<string>('all') // Default to all countries
  const [languageFilter, setLanguageFilter] = useState<keyof typeof approvedSources>('en') // Default to English

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          'https://api.gdeltproject.org/api/v2/doc/doc?query=(food OR cooking OR cuisine OR "food science" OR "food technology" OR "food safety" OR agriculture OR "organic farming" OR "food supply chain" OR "food sustainability" OR "food security" OR "food waste" OR "restaurant industry" OR "plant-based")&mode=ArtList&format=json'
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log('Fetched articles:', data.articles)

        // Assign importance manually for testing
        const articlesWithImportance = (data.articles || []).map(
          (article: Article, index: number) => ({
            ...article,
            importance: index === 0 ? 1 : index <= 3 ? 2 : 3,
          })
        )

        setAllArticles(articlesWithImportance)
        setFilteredArticles(articlesWithImportance) // Initialize with all articles
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  useEffect(() => {
    let filtered = allArticles.filter((article) => article.socialimage) // Ensure only articles with images

    const sources = approvedSources[languageFilter] || []
    filtered = filtered.filter((article) => sources.includes(article.domain))

    if (countryFilter !== 'all') {
      filtered = filtered.filter((article) => article.sourcecountry === countryFilter)
    }

    console.log('Filtered articles:', filtered)
    setFilteredArticles(filtered)
  }, [countryFilter, languageFilter, allArticles])

  const formatDate = (dateString: string) => {
    const year = dateString.slice(0, 4)
    const month = dateString.slice(4, 6)
    const day = dateString.slice(6, 8)
    return new Date(`${year}-${month}-${day}`).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-center'>
          <div
            className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full'
            role='status'
          >
            <span className='visually-hidden'>Loading...</span>
          </div>
          <p className='mt-2 text-gray-700 dark:text-gray-300'>Loading articles...</p>
        </div>
      </div>
    )
  }

  // Example sections
  const heroArticle = filteredArticles.find((article) => (article.importance ?? 0) === 1)
  const highlightedArticles = filteredArticles.filter(
    (article) => (article.importance ?? 0) > 1 && (article.importance ?? 0) <= 3
  )
  const linkOnlyArticles = filteredArticles.filter((article) => !article.socialimage)

  // Second hero article for further down the page
  const secondHeroArticle = filteredArticles.find((article) => (article.importance ?? 0) === 2)

  console.log('Filtered articles:', filteredArticles)
  console.log('Hero Article:', heroArticle)
  console.log('Highlighted Articles:', highlightedArticles)
  console.log('Link-Only Articles:', linkOnlyArticles)

  return (
    <div className='space-y-4 relative z-10'>
      <NewsFilterBar onCountryChange={setCountryFilter} />

      {/* Hero Section */}
      {heroArticle && (
        <section className='hero-section'>
          <motion.a
            href={heroArticle.url}
            target='_blank'
            rel='noopener noreferrer'
            className='block bg-white dark:bg-gray-800 p-4 rounded shadow text-blue-500 dark:text-blue-400 relative z-20 border border-gray-300 dark:border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={heroArticle.socialimage}
              alt={heroArticle.title}
              className='w-full h-64 object-cover rounded mb-4'
            />
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
              {heroArticle.title}
            </h2>
            <p className='text-gray-700 dark:text-gray-300'>
              {heroArticle.domain} - {formatDate(heroArticle.seendate)}
            </p>
          </motion.a>
        </section>
      )}

      {/* Highlighted Stories with Links */}
      <section className='highlighted-stories'>
        <h2 className='text-xl font-bold mb-4'>Highlighted Stories</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {highlightedArticles.map((article, index) => (
            <motion.a
              key={index}
              href={article.url}
              target='_blank'
              rel='noopener noreferrer'
              className='block bg-white dark:bg-gray-800 p-4 rounded shadow text-blue-500 dark:text-blue-400 relative z-20 border border-gray-300 dark:border-gray-700'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img
                src={article.socialimage}
                alt={article.title}
                className='w-full h-48 object-cover rounded mb-4'
              />
              <h2 className='text-lg font-bold text-gray-900 dark:text-white'>{article.title}</h2>
              <p className='text-gray-700 dark:text-gray-300'>
                {article.domain} - {formatDate(article.seendate)}
              </p>
            </motion.a>
          ))}
        </div>
        {/* Link-Only Subsection with Header Image */}
        {linkOnlyArticles.length > 0 && (
          <div className='link-only-subsection mt-4'>
            <h3 className='text-lg font-bold mb-2'>Related Links</h3>
            <motion.a
              href={linkOnlyArticles[0].url}
              target='_blank'
              rel='noopener noreferrer'
              className='block bg-white dark:bg-gray-800 p-4 rounded shadow text-blue-500 dark:text-blue-400 relative z-20 border border-gray-300 dark:border-gray-700 mb-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={linkOnlyArticles[0].socialimage}
                alt={linkOnlyArticles[0].title}
                className='w-full h-48 object-cover rounded mb-4'
              />
              <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
                {linkOnlyArticles[0].title}
              </h2>
              <p className='text-gray-700 dark:text-gray-300'>
                {linkOnlyArticles[0].domain} - {formatDate(linkOnlyArticles[0].seendate)}
              </p>
            </motion.a>
            <ul className='list-disc pl-5'>
              {linkOnlyArticles.slice(1, 6).map((article, index) => (
                <li key={index} className='mb-2'>
                  <a
                    href={article.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-500 dark:text-blue-400'
                  >
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Second Hero Section */}
      {secondHeroArticle && (
        <section className='hero-section'>
          <motion.a
            href={secondHeroArticle.url}
            target='_blank'
            rel='noopener noreferrer'
            className='block bg-white dark:bg-gray-800 p-4 rounded shadow text-blue-500 dark:text-blue-400 relative z-20 border border-gray-300 dark:border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={secondHeroArticle.socialimage}
              alt={secondHeroArticle.title}
              className='w-full h-64 object-cover rounded mb-4'
            />
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
              {secondHeroArticle.title}
            </h2>
            <p className='text-gray-700 dark:text-gray-300'>
              {secondHeroArticle.domain} - {formatDate(secondHeroArticle.seendate)}
            </p>
          </motion.a>
        </section>
      )}
    </div>
  )
}

export default NewsClient
