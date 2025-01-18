import React, { useState } from 'react'
import { IconMenu } from '@/app/api/icons'

interface NewsFilterBarProps {
  onCountryChange: (country: string) => void
}

const NewsFilterBar: React.FC<NewsFilterBarProps> = ({ onCountryChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='relative'>
      <button onClick={toggleDropdown} className='p-2 border rounded bg-blue-500 text-white'>
        <IconMenu className='w-6 h-6' />
      </button>
      {isOpen && (
        <div className='absolute bg-white shadow-lg rounded mt-2 w-64 z-50'>
          <div className='p-4'>
            <h3 className='font-bold mb-2'>Categories</h3>
            <div className='mb-4'>
              <h4 className='font-semibold'>Country</h4>
              <ul className='list-disc pl-5'>
                <li>
                  <button onClick={() => onCountryChange('US')} className='text-blue-500'>
                    United States
                  </button>
                </li>
                <li>
                  <button onClick={() => onCountryChange('ES')} className='text-blue-500'>
                    Spain
                  </button>
                </li>
                <li>
                  <button onClick={() => onCountryChange('FR')} className='text-blue-500'>
                    France
                  </button>
                </li>
                {/* Add more countries as needed */}
              </ul>
            </div>
            {/* Add more categories and links as needed */}
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsFilterBar
