'use client'

import React from 'react'
import { motion, MotionProps } from 'framer-motion'

export interface FormSectionProps extends MotionProps {
  title?: string
  icon?: React.ReactNode
  description?: string
  children: React.ReactNode
  className?: string
  required?: boolean
  theme?: string
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
}

const contentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
}

export function FormSection({
  title,
  icon,
  children,
  description,
  className,
  theme,
}: FormSectionProps) {
  return (
    <motion.section
      variants={sectionVariants}
      initial='hidden'
      animate='visible'
      className={`space-y-4 p-6 bg-github-canvas-subtle rounded-lg 
                  border border-github-border-default
                  shadow-sm hover:shadow-md transition-all
                  hover:border-github-border-muted
                  group ${className || ''}`}
    >
      <motion.div variants={contentVariants} className='flex items-center gap-2'>
        {icon && (
          <div
            className='w-5 h-5 text-github-fg-muted 
                        group-hover:text-github-accent-emphasis transition-colors'
          >
            {icon}
          </div>
        )}
        {title && (
          <h3
            className='text-lg font-medium text-github-fg-default 
                       group-hover:text-github-accent-emphasis transition-colors'
          >
            {title}
          </h3>
        )}
      </motion.div>

      {description && (
        <motion.p variants={contentVariants} className='text-sm text-github-fg-muted'>
          {description}
        </motion.p>
      )}

      <motion.div variants={contentVariants} className='space-y-4'>
        {children}
      </motion.div>
    </motion.section>
  )
}
