'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import NewsFilterBar from './NewsFilterBar'
import {
  IconCalendar,
  IconEye,
  IconChevronRight,
  IconLink,
  IconGlobe, // We'll use this for the "currently viewing" section
} from '@/app/api/icons'

// Minimal language map for GDELT
const gdeltLanguageMap: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
}

// Multi-word countries
const gdeltCountryMap: Record<string, string> = {
  US: 'UnitedStates',
  UK: 'UnitedKingdom',
  CA: 'Canada',
  AU: 'Australia',
  IE: 'Ireland',
  NZ: 'NewZealand',
  FR: 'France',
  ES: 'Spain',
  MX: 'Mexico',
  AR: 'Argentina',
  DE: 'Germany',
  CN: 'China',
  JP: 'Japan',
  BR: 'Brazil',
  // Add more as needed...
}

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
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  // Default user selection
  const [languageFilter, setLanguageFilter] = useState('en')
  const [countryFilter, setCountryFilter] = useState('US')

  const articlesRef = useRef<Article[]>([])

  // Build short GDELT query
  function buildGdeltQuery(lang: string, ctry: string): string {
    const gdeltLang = gdeltLanguageMap[lang] || ''
    const gdeltCtry = gdeltCountryMap[ctry] || ''

    // Short query to avoid "too long" issues
    let query = '(food OR cooking)'

    if (gdeltLang) {
      query += ` sourcelang:${gdeltLang}`
    }
    if (gdeltCtry) {
      query += ` sourcecountry:${gdeltCtry}`
    }

    return encodeURIComponent(query)
  }

  const fetchNews = async () => {
    try {
      setLoading(true)

      const queryParam = buildGdeltQuery(languageFilter, countryFilter)
      const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${queryParam}&mode=ArtList&format=json&maxrecords=50`
      console.log('GDELT API URL:', url)

      const response = await fetch(url)
      const rawText = await response.text()

      let data
      try {
        data = JSON.parse(rawText)
      } catch (err) {
        console.error('GDELT error response:', rawText)
        throw new Error('Failed to parse GDELT JSON. See console for GDELT error text.')
      }

      if (!data.articles || !Array.isArray(data.articles)) {
        console.warn('No articles found or data is malformed.')
        setAllArticles([])
        setFilteredArticles([])
        return
      }

      console.log('Fetched articles from GDELT:', data.articles)

      // Assign importance
      const articlesWithImportance = data.articles.map((art: Article, idx: number) => ({
        ...art,
        // e.g. hero = 1, featured = 2, rest = 3
        importance: idx === 0 ? 1 : idx < 5 ? 2 : 3,
      }))

      articlesRef.current = articlesWithImportance
      setAllArticles(articlesWithImportance)
      setFilteredArticles(articlesWithImportance) // no local filter needed
    } catch (error) {
      console.error('Error fetching from GDELT:', error)
      setAllArticles([])
      setFilteredArticles([])
    } finally {
      setLoading(false)
    }
  }

  // Re-fetch if language/country changes
  useEffect(() => {
    console.log(`Filtering for Language: ${languageFilter}, Country: ${countryFilter}`)
    fetchNews()
  }, [languageFilter, countryFilter])

  const handleCountryChange = (lang: string, country: string) => {
    console.log(`Filtering for Language: ${lang}, Country: ${country}`)
    setLanguageFilter(lang)
    setCountryFilter(country)
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
          <p className='mt-2 text-github-fg-muted'>Loading articles...</p>
        </div>
      </div>
    )
  }

  // Basic grouping
  const heroArticle = filteredArticles.find((a) => a.importance === 1)
  const featuredArticles = filteredArticles.filter((a) => a.importance === 2)
  const otherArticles = filteredArticles.filter((a) => a.importance === 3)

  const linkOnlyArticles = otherArticles.filter((a) => !a.socialimage)
  const imageArticles = otherArticles.filter((a) => a.socialimage)

  const formatDate = (dateString: string) => {
    const y = dateString.slice(0, 4)
    const m = dateString.slice(4, 6)
    const d = dateString.slice(6, 8)
    return `${y}-${m}-${d}`
  }

  // Horizontal scroller
  const FeaturedScroller: React.FC<{ articles: Article[] }> = ({ articles }) => {
    return (
      <div className='overflow-x-auto whitespace-nowrap py-2'>
        <div className='flex space-x-4'>
          {articles.map((art, i) => (
            <motion.a
              key={i}
              href={art.url}
              target='_blank'
              rel='noopener noreferrer'
              className='min-w-[300px] max-w-xs flex-shrink-0 rounded-md overflow-hidden 
                border border-github-border-default 
                hover:border-github-accent-fg hover:bg-github-canvas-subtle transition-colors'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {art.socialimage && (
                <img src={art.socialimage} alt={art.title} className='w-full h-40 object-cover' />
              )}
              <div className='p-2'>
                <h4 className='font-bold text-sm line-clamp-2'>{art.title}</h4>
                <p className='text-xs text-github-fg-muted mt-1 flex flex-col sm:flex-row sm:items-center sm:space-x-2'>
                  <span className='flex items-center space-x-1'>
                    <IconCalendar className='w-4 h-4 inline-block' />
                    <span>{formatDate(art.seendate)}</span>
                  </span>
                  <span className='mt-1 sm:mt-0 text-github-fg-subtle'>| {art.domain}</span>
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    )
  }

  // Image grid
  const ImageGrid: React.FC<{ articles: Article[] }> = ({ articles }) => (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4'>
      {articles.map((art, i) => (
        <motion.a
          key={i}
          href={art.url}
          target='_blank'
          rel='noopener noreferrer'
          className='rounded-md overflow-hidden 
            border border-github-border-default 
            hover:border-github-accent-fg hover:bg-github-canvas-subtle transition-colors'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {art.socialimage && (
            <img src={art.socialimage} alt={art.title} className='w-full h-40 object-cover' />
          )}
          <div className='p-2'>
            <h5 className='font-semibold text-sm line-clamp-2 mb-1'>{art.title}</h5>
            <p className='text-xs text-github-fg-muted flex flex-col sm:flex-row sm:items-center sm:space-x-2'>
              <span className='flex items-center space-x-1'>
                <IconCalendar className='w-4 h-4' />
                <span>{formatDate(art.seendate)}</span>
              </span>
              <span className='mt-1 sm:mt-0 text-github-fg-subtle'>| {art.domain}</span>
            </p>
          </div>
        </motion.a>
      ))}
    </div>
  )

  // Link-only list
  const LinkList: React.FC<{ articles: Article[] }> = ({ articles }) => (
    <ul className='space-y-2 pl-4 list-disc'>
      {articles.map((art, i) => (
        <li key={i}>
          <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-2'>
            <a
              href={art.url}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center space-x-2 
                text-github-accent-fg hover:underline'
            >
              <IconLink className='w-4 h-4 flex-shrink-0' />
              <span className='line-clamp-1'>{art.title}</span>
            </a>
            <span className='text-xs text-github-fg-subtle mt-1 sm:mt-0'>
              (Source: {art.domain})
            </span>
          </div>
        </li>
      ))}
    </ul>
  )

  return (
    <div className='space-y-6 relative z-10'>
      {/* Filter Bar (z-50 is on the component itself) */}
      <NewsFilterBar onCountryChange={handleCountryChange} />

      {/* STYLED "Currently Viewing" BOX */}
      <div className='bg-github-canvas-subtle border border-github-border-default rounded-md p-4 text-center my-4 mx-auto max-w-xl flex flex-col justify-center items-center space-y-2'>
        <div className='flex items-center space-x-2'>
          <IconGlobe className='w-5 h-5 text-github-fg-muted' />
          <p className='text-sm text-github-fg-muted'>
            Currently viewing{' '}
            <strong className='text-github-fg-default'>{languageFilter.toUpperCase()}</strong> news
            from <strong className='text-github-fg-default'>{countryFilter.toUpperCase()}</strong>
          </p>
        </div>
      </div>

      {/* Hero */}
      {heroArticle && (
        <section className='relative w-full mx-auto border border-github-border-default rounded-md overflow-hidden'>
          <motion.a
            href={heroArticle.url}
            target='_blank'
            rel='noopener noreferrer'
            className='block border border-github-border-default 
              hover:border-github-accent-fg hover:bg-github-canvas-subtle transition-colors'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {heroArticle.socialimage && (
              <img
                src={heroArticle.socialimage}
                alt={heroArticle.title}
                className='w-full h-[40vh] object-cover'
              />
            )}
            <div className='p-4 bg-github-canvas-subtle'>
              <h2 className='text-2xl font-bold mb-2'>{heroArticle.title}</h2>
              <p className='text-sm text-github-fg-muted mb-2 flex flex-col sm:flex-row sm:items-center sm:space-x-2'>
                <span className='flex items-center space-x-1'>
                  <IconCalendar className='w-4 h-4 inline-block' />
                  <span>{formatDate(heroArticle.seendate)}</span>
                </span>
                <span className='mt-1 sm:mt-0 text-github-fg-subtle'>| {heroArticle.domain}</span>
              </p>
            </div>
          </motion.a>
        </section>
      )}

      {/* Featured Horizontal Scroller */}
      {featuredArticles.length > 0 && (
        <section className='border border-github-border-default p-4 rounded-md'>
          <h3 className='text-xl font-bold mb-2 flex items-center space-x-2'>
            <IconEye className='w-5 h-5' />
            <span>Featured Articles</span>
          </h3>
          <FeaturedScroller articles={featuredArticles} />
        </section>
      )}

      {/* Link-Only Articles */}
      {linkOnlyArticles.length > 0 && (
        <section className='border border-github-border-default rounded-md p-4'>
          <h3 className='text-xl font-bold mb-2 flex items-center space-x-2'>
            <IconLink className='w-5 h-5' />
            <span>Quick Links</span>
          </h3>
          <LinkList articles={linkOnlyArticles} />
        </section>
      )}

      {/* Additional images in a grid */}
      {imageArticles.length > 0 && (
        <section>
          <h3 className='text-xl font-bold mb-2 flex items-center space-x-2'>
            <IconChevronRight className='w-5 h-5' />
            <span>More Stories</span>
          </h3>
          <ImageGrid articles={imageArticles} />
        </section>
      )}
    </div>
  )
}

export default NewsClient
