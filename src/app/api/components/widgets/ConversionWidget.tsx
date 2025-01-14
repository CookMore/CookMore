'use client'

import React, { useState } from 'react'

const conversions = {
  Volume: [
    { name: 'Cups to Milliliters', formula: (value: number) => value * 236.588 },
    { name: 'Tablespoons to Milliliters', formula: (value: number) => value * 14.787 },
    { name: 'Teaspoons to Milliliters', formula: (value: number) => value * 4.929 },
    { name: 'Liters to Cups', formula: (value: number) => value * 4.227 },
    { name: 'Fluid Ounces to Milliliters', formula: (value: number) => value * 29.5735 },
  ],
  Weight: [
    { name: 'Grams to Ounces', formula: (value: number) => value * 0.035274 },
    { name: 'Ounces to Grams', formula: (value: number) => value * 28.3495 },
    { name: 'Pounds to Kilograms', formula: (value: number) => value * 0.453592 },
    { name: 'Kilograms to Pounds', formula: (value: number) => value * 2.20462 },
    { name: 'Grams to Pounds', formula: (value: number) => value * 0.00220462 },
  ],
  Temperature: [
    { name: 'Celsius to Fahrenheit', formula: (value: number) => (value * 9) / 5 + 32 },
    { name: 'Fahrenheit to Celsius', formula: (value: number) => ((value - 32) * 5) / 9 },
  ],
}

const countries = [
  { name: 'USA', system: 'imperial' },
  { name: 'UK', system: 'imperial' },
  { name: 'Canada', system: 'metric' },
  { name: 'Australia', system: 'metric' },
  { name: 'India', system: 'metric' },
  { name: 'France', system: 'metric' },
  { name: 'Italy', system: 'metric' },
  { name: 'Spain', system: 'metric' },
  { name: 'Japan', system: 'metric' },
  { name: 'China', system: 'metric' },
  { name: 'Mexico', system: 'metric' },
  { name: 'Thailand', system: 'metric' },
  { name: 'Greece', system: 'metric' },
  { name: 'Turkey', system: 'metric' },
  { name: 'Brazil', system: 'metric' },
  { name: 'Argentina', system: 'metric' },
  { name: 'Germany', system: 'metric' },
  { name: 'South Korea', system: 'metric' },
  { name: 'Vietnam', system: 'metric' },
  { name: 'Indonesia', system: 'metric' },
  { name: 'Malaysia', system: 'metric' },
  { name: 'Philippines', system: 'metric' },
  { name: 'Portugal', system: 'metric' },
  { name: 'Morocco', system: 'metric' },
  { name: 'Peru', system: 'metric' },
  { name: 'Colombia', system: 'metric' },
  { name: 'Chile', system: 'metric' },
  { name: 'Egypt', system: 'metric' },
  { name: 'Russia', system: 'metric' },
  { name: 'Sweden', system: 'metric' },
  { name: 'Norway', system: 'metric' },
  { name: 'Denmark', system: 'metric' },
  { name: 'Finland', system: 'metric' },
  { name: 'Netherlands', system: 'metric' },
  { name: 'Belgium', system: 'metric' },
  { name: 'Switzerland', system: 'metric' },
  { name: 'Austria', system: 'metric' },
  { name: 'Hungary', system: 'metric' },
  { name: 'Poland', system: 'metric' },
  { name: 'Czech Republic', system: 'metric' },
  { name: 'Slovakia', system: 'metric' },
  { name: 'Romania', system: 'metric' },
  { name: 'Bulgaria', system: 'metric' },
  { name: 'Croatia', system: 'metric' },
  { name: 'Serbia', system: 'metric' },
  { name: 'Slovenia', system: 'metric' },
  { name: 'Bosnia and Herzegovina', system: 'metric' },
  { name: 'Montenegro', system: 'metric' },
  { name: 'Albania', system: 'metric' },
  { name: 'Macedonia', system: 'metric' },
  { name: 'Ukraine', system: 'metric' },
  { name: 'Belarus', system: 'metric' },
  { name: 'Lithuania', system: 'metric' },
  { name: 'Latvia', system: 'metric' },
  { name: 'Estonia', system: 'metric' },
  { name: 'Iceland', system: 'metric' },
  { name: 'Ireland', system: 'metric' },
  { name: 'New Zealand', system: 'metric' },
  { name: 'South Africa', system: 'metric' },
  { name: 'Nigeria', system: 'metric' },
  { name: 'Kenya', system: 'metric' },
  { name: 'Ghana', system: 'metric' },
  { name: 'Ethiopia', system: 'metric' },
  { name: 'Tanzania', system: 'metric' },
  { name: 'Uganda', system: 'metric' },
  { name: 'Algeria', system: 'metric' },
  { name: 'Tunisia', system: 'metric' },
  { name: 'Saudi Arabia', system: 'metric' },
  { name: 'United Arab Emirates', system: 'metric' },
  { name: 'Qatar', system: 'metric' },
  { name: 'Kuwait', system: 'metric' },
  { name: 'Bahrain', system: 'metric' },
  { name: 'Oman', system: 'metric' },
  { name: 'Jordan', system: 'metric' },
  { name: 'Lebanon', system: 'metric' },
  { name: 'Israel', system: 'metric' },
  { name: 'Iran', system: 'metric' },
  { name: 'Iraq', system: 'metric' },
  { name: 'Syria', system: 'metric' },
  { name: 'Pakistan', system: 'metric' },
  { name: 'Bangladesh', system: 'metric' },
  { name: 'Sri Lanka', system: 'metric' },
  { name: 'Nepal', system: 'metric' },
  { name: 'Bhutan', system: 'metric' },
  { name: 'Maldives', system: 'metric' },
  { name: 'Afghanistan', system: 'metric' },
  { name: 'Kazakhstan', system: 'metric' },
  { name: 'Uzbekistan', system: 'metric' },
  { name: 'Turkmenistan', system: 'metric' },
  { name: 'Kyrgyzstan', system: 'metric' },
  { name: 'Tajikistan', system: 'metric' },
  { name: 'Mongolia', system: 'metric' },
  { name: 'Myanmar', system: 'metric' },
  { name: 'Cambodia', system: 'metric' },
  { name: 'Laos', system: 'metric' },
  { name: 'Brunei', system: 'metric' },
  { name: 'Singapore', system: 'metric' },
  { name: 'Taiwan', system: 'metric' },
  { name: 'Hong Kong', system: 'metric' },
  { name: 'Macau', system: 'metric' },
]

export default function ConversionWidget() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof conversions>('Volume')
  const [inputValue, setInputValue] = useState<string>('')
  const [conversionResult, setConversionResult] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string>('USA')

  const handleConversion = (formula: (value: number) => number) => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      setConversionResult('Invalid input')
      return
    }
    setConversionResult(formula(value).toFixed(2))
  }

  const filteredConversions = conversions[selectedCategory]

  return (
    <div className='p-2 border border-github-border-default shadow-lg rounded-md bg-github-canvas-default'>
      <div className='p-2'>
        <div className='mb-4'>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className='w-full mb-2 px-3 py-1 bg-github-canvas-subtle text-github-fg-default border border-github-border-default rounded-md'
          >
            {countries.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Enter value to convert'
            className='w-full mb-2 px-3 py-1 bg-github-canvas-subtle text-github-fg-default border border-github-border-default rounded-md'
          />
          <div className='flex space-x-1 mb-1 overflow-x-auto'>
            {Object.keys(conversions).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as keyof typeof conversions)}
                className={`px-3 py-1 rounded-md ${selectedCategory === category ? 'bg-github-btn-hover' : 'bg-github-btn-bg'} text-github-fg-default`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className='overflow-y-auto max-h-32'>
            {filteredConversions.map((conversion) => (
              <button
                key={conversion.name}
                onClick={() => handleConversion(conversion.formula)}
                className='block w-full text-left px-3 py-1 bg-github-canvas-default text-github-fg-default border-b border-github-border-default hover:bg-github-btn-hover'
              >
                {conversion.name}
              </button>
            ))}
          </div>
        </div>
        {conversionResult && (
          <div className='p-2 bg-github-canvas-subtle rounded-md'>
            <p className='text-github-fg-default text-[75pt] font-bold'>
              Result: {conversionResult}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
