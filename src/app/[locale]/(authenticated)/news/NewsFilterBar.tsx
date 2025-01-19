'use client'

import React, { useState } from 'react'
import { IconMenu, IconChevronDown, IconPalette, IconLanguage } from '@/app/api/icons'
import CountryFlag from 'react-country-flag'

// Map your UI language code => actual text (for display)
const languages = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
}

// Which countries are relevant for each language?
// e.g. English => US, UK, CA, etc.
const languageToCountries: Record<string, string[]> = {
  en: ['US', 'UK', 'CA', 'AU', 'IE', 'NZ'],
  es: ['ES', 'MX', 'AR'],
  fr: ['FR', 'CA', 'BE', 'CH'],
  de: ['DE', 'AT', 'CH'],
  it: ['IT', 'CH'],
  pt: ['PT', 'BR'],
  ru: ['RU'],
  zh: ['CN', 'TW', 'HK', 'SG'],
  ja: ['JP'],
  ko: ['KR'],
}

interface NewsFilterBarProps {
  /** Called when user selects a language + country combo */
  onCountryChange?: (lang: string, country: string) => void
}

const NewsFilterBar: React.FC<NewsFilterBarProps> = ({ onCountryChange = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen((prev) => !prev)

  return (
    <div className='relative z-50'>
      <button
        onClick={toggleDropdown}
        className='p-2 mt-4 border rounded-full 
          bg-github-canvas-subtle hover:bg-github-canvas-inset 
          text-github-fg-default hover:text-github-fg-muted 
          transition-colors border-github-border-default
          flex items-center space-x-1'
      >
        <IconMenu className='h-5 w-5' />
        <span className='text-sm hidden sm:inline-block'>Filters</span>
      </button>

      {isOpen && (
        <div
          className='absolute top-16 left-0 w-full md:w-[85%] lg:w-[70%] 
            bg-github-canvas-overlay shadow-lg 
            rounded-md z-50 p-4 border border-github-border-default
            mx-auto right-0
            '
          style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
        >
          <div className='flex flex-col md:flex-row md:justify-between md:space-x-4'>
            {/* Language Section */}
            <div className='mb-4 md:mb-0 flex-1'>
              <h4 className='font-bold mb-2 text-github-fg-default flex items-center space-x-1'>
                <IconLanguage className='w-5 h-5' />
                <span>Select Language & Country</span>
              </h4>
              <div className='flex flex-wrap items-start space-y-2 md:space-y-0'>
                {Object.entries(languageToCountries).map(([langCode, countryCodes]) => (
                  <div key={langCode} className='m-2'>
                    <div className='border border-github-border-default rounded-md p-2'>
                      <h5 className='font-semibold text-github-fg-default text-center'>
                        {languages[langCode as keyof typeof languages]}
                      </h5>
                      <ul className='list-none flex flex-wrap justify-center'>
                        {countryCodes.map((country) => (
                          <li key={country} className='m-1'>
                            <button
                              onClick={() => {
                                onCountryChange(langCode, country)
                                setIsOpen(false) // close after selection
                              }}
                              className='block text-center px-4 py-2 
                                text-github-fg-default 
                                hover:bg-github-canvas-subtle
                                transition-colors rounded-md cursor-pointer 
                                flex items-center justify-center'
                              style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}
                            >
                              <CountryFlag countryCode={country} svg className='mr-2 h-5 w-5' />
                              {country}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Example of another settings area (theme or advanced filters) */}
            <div className='mt-4 md:mt-0 flex-1'>
              <h4 className='font-bold mb-2 text-github-fg-default flex items-center space-x-1'>
                <IconPalette className='w-5 h-5' />
                <span>Layout / Theme</span>
              </h4>
              <div className='flex flex-col space-y-2'>
                <button
                  className='btn btn-primary'
                  onClick={() => alert('You could implement a theme switcher here!')}
                >
                  Switch Theme
                </button>
                <button
                  className='btn btn-secondary'
                  onClick={() => alert('Another advanced filter or layout toggle.')}
                >
                  Layout Toggle
                </button>
              </div>
            </div>
          </div>

          <div className='mt-6 text-right'>
            <button
              onClick={() => setIsOpen(false)}
              className='px-4 py-2 rounded-md bg-github-btn-bg hover:bg-github-btn-hover text-github-fg-default border border-github-border-default'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsFilterBar
