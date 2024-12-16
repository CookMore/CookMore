'use client'

import { motion } from 'framer-motion'

export function TypingIndicator() {
  return (
    <div className='flex items-center gap-1 px-2'>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className='w-1.5 h-1.5 bg-github-accent-fg rounded-full'
          animate={{
            y: ['0%', '-50%', '0%'],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  )
}
