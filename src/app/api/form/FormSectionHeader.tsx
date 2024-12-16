import React from 'react'
import { motion } from 'framer-motion'
import { IconChevronDown } from '../icons'

interface FormSectionHeaderProps {
  title: string
  icon?: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  badge?: string | number
}

export function FormSectionHeader({
  title,
  icon,
  isExpanded,
  onToggle,
  badge,
}: FormSectionHeaderProps) {
  return (
    <motion.button
      type='button'
      onClick={onToggle}
      className='w-full flex items-center justify-between p-4 
                hover:bg-github-canvas-subtle rounded-lg
                transition-colors group'
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className='flex items-center gap-2'>
        {icon && (
          <motion.div
            className='w-5 h-5 text-github-fg-muted 
                     group-hover:text-github-accent-emphasis'
            animate={{ rotate: isExpanded ? 90 : 0 }}
          >
            {icon}
          </motion.div>
        )}
        <h3
          className='text-lg font-medium text-github-fg-default 
                     group-hover:text-github-accent-emphasis'
        >
          {title}
        </h3>
        {badge && (
          <span
            className='ml-2 px-2 py-0.5 text-xs rounded-full 
                        bg-github-accent-muted text-github-accent-fg'
          >
            {badge}
          </span>
        )}
      </div>

      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className='text-github-fg-muted'
      >
        <IconChevronDown className='w-5 h-5' />
      </motion.div>
    </motion.button>
  )
}
