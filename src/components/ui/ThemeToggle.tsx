'use client'

import { useTheme } from '@/app/providers/ThemeProvider'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant='ghost' size='sm' className='w-8 h-8 px-0'>
        <div className='h-4 w-4 animate-pulse bg-github-canvas-subtle rounded' />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='w-8 h-8 px-0'>
          {theme === 'dark' && <Icons.moon className='h-4 w-4' />}
          {theme === 'light' && <Icons.sun className='h-4 w-4' />}
          {theme === 'neo' && <Icons.settings className='h-4 w-4' />}
          {theme === 'copper' && <Icons.palette className='h-4 w-4' />}
          {theme === 'steel' && <Icons.settings className='h-4 w-4' />}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Icons.sun className='mr-2 h-4 w-4' />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Icons.moon className='mr-2 h-4 w-4' />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('neo')}>
          <Icons.settings className='mr-2 h-4 w-4' />
          <span>Neo</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('copper')}>
          <Icons.palette className='mr-2 h-4 w-4' />
          <span>Copper</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('steel')}>
          <Icons.settings className='mr-2 h-4 w-4' />
          <span>Steel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
