'use client'

import { cn } from '@/app/api/utils/utils'

interface CookMoreLogoProps {
  className?: string
  color?: string
}

export function CookMoreLogo({ className, color = 'currentColor' }: CookMoreLogoProps) {
  return (
    <svg
      width='100%'
      height='100%'
      viewBox='0 0 300 60'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('text-github-fg-default', className)}
    >
      <defs>
        <style>
          {`
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 700;
              src: url('/fonts/Inter-Bold.woff2') format('woff2');
            }
          `}
        </style>
      </defs>
      <text
        x='50%'
        y='50%'
        dominantBaseline='middle'
        textAnchor='middle'
        fill={color}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '48px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        CookMore
      </text>
    </svg>
  )
}
