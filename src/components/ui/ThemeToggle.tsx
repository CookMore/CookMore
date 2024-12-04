'use client'

import { useTheme } from '@/app/providers/ThemeProvider'
import { IconPalette } from '@/components/ui/icons'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

const themes = [
  {
    name: 'Dark',
    value: 'dark',
    icon: '🌙',
  },
  {
    name: 'Light',
    value: 'light',
    icon: '☀️',
  },
  {
    name: 'Neo',
    value: 'neo',
    icon: '🎨',
  },
  {
    name: 'Wooden',
    value: 'wooden',
    icon: '🪵',
  },
  {
    name: 'Steel',
    value: 'steel',
    icon: '🔧',
  },
  {
    name: 'Silicone',
    value: 'silicone',
    icon: '🧊',
  },
  {
    name: 'Copper',
    value: 'copper',
    icon: '🫕',
  },
  {
    name: 'Ceramic',
    value: 'ceramic',
    icon: '🍽️',
  },
  {
    name: 'Marble',
    value: 'marble',
    icon: '🪨',
  },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className='flex items-center gap-2 px-3 py-2 text-sm text-github-fg-muted hover:text-github-fg-default'>
          <IconPalette className='w-4 h-4' />
          <span>Theme</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className='z-50 min-w-[180px] bg-github-canvas-overlay rounded-md p-1 shadow-lg'
          align='end'
        >
          {themes.map(({ name, value, icon }) => (
            <DropdownMenu.Item
              key={value}
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm outline-none cursor-default',
                theme === value
                  ? 'bg-github-accent-emphasis text-github-fg-onEmphasis'
                  : 'text-github-fg-default hover:bg-github-canvas-subtle'
              )}
              onClick={() => setTheme(value)}
            >
              <span>{icon}</span>
              <span>{name}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
